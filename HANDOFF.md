# 🦍 GorilApp v2.1 - Documento de Traspaso (Handoff)

**Fecha**: 23 Septiembre 2026  
**Autor**: Jimmy80 & Antigravity  
**Versión**: `2.1.0`  
**Estado**: Producción Activa / PWA Funcional  
**Acceso Remoto**: `https://jamesnas.tail7ea469.ts.net`

---

## 1. Resumen Ejecutivo
GorilApp es una aplicación web progresiva (PWA) de alto rendimiento para el seguimiento y registro de entrenamientos en el gimnasio. Funciona 100% offline, almacena todos los datos en el propio dispositivo del usuario mediante IndexedDB (Dexie.js), cuenta con prevención activa contra el apagado de pantalla en móvil y está desplegada en un contenedor LXC dedicado en el servidor Proxmox de la red doméstica con acceso seguro mundial vía Tailscale y certificado SSL oficial de Let's Encrypt.

---

## 2. Arquitectura del Sistema

### Frontend & Core
- **Framework**: React 19 + Vite 7 (SPA).
- **Estilos**: Vanilla CSS modular (`src/index.css`) con tema deportivo oscuro "Gorilas Team", Glassmorphism, y layout responsive sin desbordamientos en pantallas móviles estrechas.
- **Base de Datos Local**: Dexie.js (IndexedDB en el navegador).
  - Tablas: `workouts`, `exercises`, `sessions`, `sets`.
  - Transacciones robustas con timeout de seguridad (previene bloqueos de carga).
- **Anti-bloqueo de pantalla**: Sistema híbrido en `src/utils/wakeLock.js`:
  - `NoSleep.js`: Micro-stream multimedia en bucle para mantener despierto el sistema operativo en iOS y Android (incluso con pantalla atenuada).
  - `Wake Lock API`: Soporte nativo para contextos seguros.
- **Capacidades PWA**: `vite-plugin-pwa` con Service Worker (`sw.js`), pre-caché de assets estáticos y fuentes de Google Fonts, manifest web (`manifest.json` y `manifest.webmanifest`), e instalador guiado en la pestaña Perfil (`src/components/InstallPwaPrompt.jsx`).

### Backend & Servidor
- **Servidor Web**: `server.cjs` (Express 5 + Compression + HTTPS).
- **Puertos**:
  - `3000`: HTTP estándar.
  - `3443`: HTTPS con certificados SSL oficiales de Let's Encrypt generados vía Tailscale.
- **Enrutamiento**: Fallback SPA compatible con Express 5 (`app.use((req, res) => res.sendFile(...))`).

---

## 3. Infraestructura y Despliegue

### Host Proxmox VE (`192.168.1.58`)
- **Host Tailscale**: `jamesnas` (`100.110.22.108`).
- **Dominio MagicDNS**: `jamesnas.tail7ea469.ts.net`.
- **Certificados SSL**: Emitidos por Let's Encrypt para `jamesnas.tail7ea469.ts.net` y alojados en `/opt/gorilapp/.certs/`.
- **Reglas de Redirección (iptables DNAT)**:
  - `Puerto 443 (Host)` ➔ `192.168.1.71:3443 (LXC)`
  - `Puerto 80 (Host)` ➔ `192.168.1.71:3000 (LXC)`
  - `Puerto 3443 (Host)` ➔ `192.168.1.71:3443 (LXC)`
  - `Puerto 3000 (Host)` ➔ `192.168.1.71:3000 (LXC)`

### Contenedor LXC 111 (`gorilapp`)
- **OS**: Debian 12 Bookworm (minimal).
- **IP Estática**: `192.168.1.71/24` (Gateway: `192.168.1.1`).
- **Recursos**: 2 Cores, 1024 MB RAM, 8 GB SSD.
- **Ruta de Instalación**: `/opt/gorilapp`.
- **Servicio Systemd**: `gorilapp.service` (habilitado en arranque).
  ```bash
  pct exec 111 -- systemctl status gorilapp.service
  ```

---

## 4. Scripts y Comandos de Operación

### Desarrollo Local
```powershell
# Arrancar servidor de desarrollo Vite
npm run dev

# Compilar para producción
npm run build

# Probar servidor Node localmente
npm start
```

### Despliegue en Proxmox LXC
- **Despliegue rápido en caliente**:
  ```powershell
  python scripts/deploy_lxc.py
  ```
  *(Empaqueta `dist/`, `server.cjs` y archivos estáticos, los sube por SSH/SFTP al host PVE, los transfiere al LXC 111 y reinicia el servicio en ~3 segundos).*
- **Creación / Reinstalación completa del LXC**:
  ```powershell
  python scripts/create_and_deploy_lxc.py
  ```

---

## 5. Datos y Rutina de Entrenamiento
- **Bloque**: *Rutina Septiembre* (4 sesiones fijas con IDs 1..4):
  1. Sesión 1: Torso Pesado (Empujes) - 8 ejercicios.
  2. Sesión 2: Pierna Completa & Core - 8 ejercicios.
  3. Sesión 3: Torso Tracciones & Hombro - 7 ejercicios.
  4. Sesión 4: Full Body Dinámico / Brazos - 7 ejercicios.
- **Respaldo de Sesión Semilla**: Incluido en `public/backup_sesion_8_ejercicios.json`, restaurable desde la pestaña *Perfil*.
- **Editor de Series**: Modal compacto (`src/components/EditSetModal.jsx`) sin scroll para corregir peso, repeticiones o RIR sobre la marcha.

---

## 6. Novedades y Mejoras Implementadas (v2.1.0)
- **Navegación Libre No Secuencial**: Selector horizontal de ejercicios integrado en la cabecera fija de `src/components/SessionTracker.jsx`. Permite saltar entre ejercicios y máquinas ocupadas manteniendo el cómputo individual de series completadas (`✓ X/Y`) sin bloqueos.
- **Fin de Sesión Seguro**: Eliminada la finalización forzada al terminar el último ejercicio. Incorporado botón explícito "Finalizar Sesión" y modal de confirmación inteligente que detecta y enumera los ejercicios con series incompletas antes de permitir salir.
- **Persistencia Continua en Segundo Plano**: Auto-guardado en tiempo real en IndexedDB y `localStorage`. Sincronización precisa en `src/components/RestTimer.jsx` mediante timestamp absoluto (`targetEndTime`), impidiendo la detención del temporizador de descanso al cambiar de app en el móvil o bloquear la pantalla.
- **Intro Cinemática (`intro.mp4`)**: Integración del componente `src/components/IntroSplash.jsx` en arranque en frío con control de reproducción y salto directo. Detección automática para omitir la intro si se reanuda una sesión activa en segundo plano.
- **Optimización de Interfaz Móvil**:
  - Reestructuración de la botonera inferior de sesión en cuadrícula de dos niveles (`1fr 1fr` para Anterior/Siguiente y fila inferior `100%` para Finalizar Sesión) garantizando 0% de desbordamiento horizontal en pantallas estrechas.
  - Retirada del badge `ONLINE` en `src/components/Layout.jsx` para maximizar la visibilidad del fondo traslúcido y la silueta del gorila.
  - Pantalla Perfil (`src/components/Profile.jsx`) actualizada con la lista de novedades y numeración v2.1.0.
