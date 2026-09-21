#!/usr/bin/env python3
"""Script de creación y despliegue del contenedor LXC 111 (gorilapp) en Proxmox."""
from __future__ import annotations

import os
import sys
import tarfile
import tempfile
import time
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

try:
    import paramiko
except ImportError:
    print("[!] Error: paramiko no está instalado")
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]

# Cargar configuración Proxmox
PVE_HOST = "192.168.1.58"
PVE_USER = "root"
PVE_PASS = "Jaime1980@"
VMID = "111"
IP = "192.168.1.71"
HOSTNAME = "gorilapp"
TEMPLATE = "local:vztmpl/debian-12-standard_12.12-1_amd64.tar.zst"
REMOTE_PATH = "/opt/gorilapp"

FILES_TO_DEPLOY = [
    "package.json",
    "server.cjs",
    "dist",
    "public",
    "src",
    "index.html",
    "vite.config.js"
]

def make_tar() -> Path:
    tmp = tempfile.NamedTemporaryFile(suffix=".tar.gz", delete=False)
    tmp.close()
    with tarfile.open(tmp.name, "w:gz") as tar:
        for rel in FILES_TO_DEPLOY:
            p = ROOT / rel
            if p.exists():
                tar.add(p, arcname=rel)
                print(f"[+] Empaquetado: {rel}")
            else:
                print(f"[-] Omitido: {rel}")
    return Path(tmp.name)

def run_cmd(ssh, cmd, ignore_error=False):
    print(f"[*] Ejecutando en PVE: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    if out:
        print(f"    {out}")
    if err and not ignore_error:
        print(f"    [ERR] {err}")
    return out

def main():
    print(f"[*] Conectando a Proxmox {PVE_HOST}...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(PVE_HOST, username=PVE_USER, password=PVE_PASS, timeout=15)

    # 1. Comprobar si LXC 111 ya existe
    out = run_cmd(ssh, f"pct status {VMID}", ignore_error=True)
    if "status:" not in out:
        print(f"[*] Creando contenedor LXC {VMID} ({HOSTNAME}) con IP {IP}...")
        create_cmd = (
            f"pct create {VMID} {TEMPLATE} "
            f"--hostname {HOSTNAME} "
            f"--cores 2 "
            f"--memory 1024 "
            f"--swap 512 "
            f"--rootfs local-lvm:8 "
            f"--net0 name=eth0,bridge=vmbr0,gw=192.168.1.1,ip={IP}/24,type=veth "
            f"--nameserver 192.168.1.1 "
            f"--ostype debian "
            f"--unprivileged 1 "
            f"--onboot 1 "
            f"--description 'GorilApp - Gym Workout Tracker PWA'"
        )
        run_cmd(ssh, create_cmd)
    else:
        print(f"[i] El contenedor LXC {VMID} ya existe.")

    # 2. Iniciar contenedor si está parado
    status = run_cmd(ssh, f"pct status {VMID}")
    if "stopped" in status:
        print(f"[*] Iniciando LXC {VMID}...")
        run_cmd(ssh, f"pct start {VMID}")
        time.sleep(5)

    # 3. Esperar que la red esté activa en el LXC
    print("[*] Verificando conectividad en el contenedor...")
    for _ in range(10):
        res = run_cmd(ssh, f"pct exec {VMID} -- ping -c 1 192.168.1.1", ignore_error=True)
        if "1 received" in res or "1 packets transmitted, 1 received" in res:
            print("[+] Red activa en LXC!")
            break
        time.sleep(2)

    # 4. Instalar Node.js 22 LTS y dependencias base
    print("[*] Comprobando Node.js en el contenedor...")
    node_chk = run_cmd(ssh, f"pct exec {VMID} -- node -v", ignore_error=True)
    if "v" not in node_chk:
        print("[*] Instalando Node.js 22 LTS en el contenedor LXC...")
        run_cmd(ssh, f"pct exec {VMID} -- apt-get update")
        run_cmd(ssh, f"pct exec {VMID} -- apt-get install -y curl ca-certificates gnupg")
        run_cmd(ssh, f"pct exec {VMID} -- bash -c 'curl -fsSL https://deb.nodesource.com/setup_22.x | bash -'")
        run_cmd(ssh, f"pct exec {VMID} -- apt-get install -y nodejs")

    # 5. Transferir código fuente y build
    tar_path = make_tar()
    remote_tar = f"/tmp/gorilapp_{VMID}.tar.gz"
    try:
        sftp = ssh.open_sftp()
        print(f"[*] Subiendo paquete a PVE: {remote_tar}...")
        sftp.put(str(tar_path), remote_tar)
        sftp.close()

        run_cmd(ssh, f"pct exec {VMID} -- mkdir -p {REMOTE_PATH}")
        run_cmd(ssh, f"pct push {VMID} {remote_tar} {remote_tar}")
        run_cmd(ssh, f"pct exec {VMID} -- tar -xzf {remote_tar} -C {REMOTE_PATH}")
        run_cmd(ssh, f"pct exec {VMID} -- rm -f {remote_tar}")
        run_cmd(ssh, f"rm -f {remote_tar}")

        print("[*] Instalando dependencias de producción en LXC...")
        run_cmd(ssh, f"pct exec {VMID} -- bash -c 'cd {REMOTE_PATH} && npm install --omit=dev'")

        # 6. Configurar servicio systemd
        service_content = """[Unit]
Description=GorilApp Gym Tracker
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/gorilapp
ExecStart=/usr/bin/node server.cjs
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=HTTPS_PORT=3443

[Install]
WantedBy=multi-user.target
"""
        svc_tmp = "/tmp/gorilapp.service"
        run_cmd(ssh, f"cat << 'EOF' > {svc_tmp}\n{service_content}\nEOF")
        run_cmd(ssh, f"pct push {VMID} {svc_tmp} /etc/systemd/system/gorilapp.service")
        run_cmd(ssh, f"rm -f {svc_tmp}")

        run_cmd(ssh, f"pct exec {VMID} -- systemctl daemon-reload")
        run_cmd(ssh, f"pct exec {VMID} -- systemctl enable --now gorilapp.service")
        run_cmd(ssh, f"pct exec {VMID} -- systemctl restart gorilapp.service")
        time.sleep(3)

        # 7. Redirigir puerto en host Proxmox (jamesnas 100.110.22.108) hacia LXC 111
        # Así desde Tailscale con IP 100.110.22.108:3000 o 3443 se accede directamente
        print("[*] Configurando redirección de puertos en jamesnas (Tailscale)...")
        run_cmd(ssh, "sysctl -w net.ipv4.ip_forward=1")
        run_cmd(ssh, f"iptables -t nat -A PREROUTING -p tcp --dport 3000 -j DNAT --to-destination {IP}:3000", ignore_error=True)
        run_cmd(ssh, f"iptables -t nat -A PREROUTING -p tcp --dport 3443 -j DNAT --to-destination {IP}:3443", ignore_error=True)
        run_cmd(ssh, f"iptables -t nat -A POSTROUTING -p tcp -d {IP} --dport 3000 -j MASQUERADE", ignore_error=True)
        run_cmd(ssh, f"iptables -t nat -A POSTROUTING -p tcp -d {IP} --dport 3443 -j MASQUERADE", ignore_error=True)

        # 8. Verificar estado
        svc_status = run_cmd(ssh, f"pct exec {VMID} -- systemctl is-active gorilapp.service")
        print(f"[+] Estado del servicio en LXC {VMID}: {svc_status}")

        print("\n=======================================================")
        print(f"  GORILAPP DESPLEGADA CON EXITO EN PROXMOX LXC {VMID}")
        print(f"  - Red Local (LAN):")
        print(f"      HTTP:  http://{IP}:3000")
        print(f"      HTTPS: https://{IP}:3443 (Para instalar PWA)")
        print(f"  - Tailscale (Desde el móvil / gimnasio):")
        print(f"      HTTP:  http://100.110.22.108:3000")
        print(f"      HTTPS: https://100.110.22.108:3443 (Para instalar PWA)")
        print("=======================================================\n")
    finally:
        if tar_path.exists():
            os.unlink(tar_path)
        ssh.close()

if __name__ == "__main__":
    main()
