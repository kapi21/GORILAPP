#!/usr/bin/env python3
"""Script de actualización y despliegue rápido de GorilApp en LXC 111."""
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

PVE_HOST = "192.168.1.58"
PVE_USER = "root"
PVE_PASS = "Jaime1980@"
VMID = "111"
REMOTE_PATH = "/opt/gorilapp"

FILES_TO_DEPLOY = [
    "package.json",
    "server.cjs",
    "dist",
    "public",
    "index.html"
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

def run_cmd(ssh, cmd):
    stdin, stdout, stderr = ssh.exec_command(cmd)
    return stdout.read().decode().strip()

def main():
    print(f"[*] Conectando a Proxmox {PVE_HOST}...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(PVE_HOST, username=PVE_USER, password=PVE_PASS, timeout=10)

    tar_path = make_tar()
    remote_tar = f"/tmp/gorilapp_update_{VMID}.tar.gz"
    try:
        sftp = ssh.open_sftp()
        print(f"[*] Subiendo actualización a PVE: {remote_tar}...")
        sftp.put(str(tar_path), remote_tar)
        sftp.close()

        run_cmd(ssh, f"pct push {VMID} {remote_tar} {remote_tar}")
        run_cmd(ssh, f"pct exec {VMID} -- tar -xzf {remote_tar} -C {REMOTE_PATH}")
        run_cmd(ssh, f"pct exec {VMID} -- rm -f {remote_tar}")
        run_cmd(ssh, f"rm -f {remote_tar}")

        print("[*] Reiniciando servicio gorilapp en LXC...")
        run_cmd(ssh, f"pct exec {VMID} -- systemctl restart gorilapp.service")
        time.sleep(2)

        status = run_cmd(ssh, f"pct exec {VMID} -- systemctl is-active gorilapp.service")
        print(f"[+] Despliegue completado! Servicio: {status}")
    finally:
        if tar_path.exists():
            os.unlink(tar_path)
        ssh.close()

if __name__ == "__main__":
    main()
