# Guía de Despliegue en Synology NAS (DS120j) 🦍

Tu **Synology DS120j** es un dispositivo ideal para alojar **GorilApp** como una página web estática, ya que consume muy pocos recursos (no necesitas Docker).

## Pasos para Desplegar

### 1. Preparar los Archivos (Build)
Ya hemos generado la versión optimizada para producción ("build").
Los archivos listos para subir están en la carpeta:
`d:\GORILAPP\dist`

*(Contiene `index.html`, carpeta `assets`, imágenes, etc.)*

### 2. Configurar el NAS (Web Station)
1.  Entra en **DSM** (tu panel de control de Synology).
2.  Abre el **Centro de Paquetes**.
3.  Instala **Web Station** (si no lo tienes).
4.  Instala **Apache HTTP Server 2.4** (Recomendado para manejar rutas de React fácilmente con un archivo `.htaccess`).

### 3. Subir los Archivos
1.  Abre **File Station** en el NAS.
2.  Ve a la carpeta compartida llamada `web` (se crea automáticamente al instalar Web Station).
3.  Crea una carpeta dentro llamada `gorilapp`.
4.  **Sube TODO el contenido** de tu carpeta local `dist` dentro de `web/gorilapp`.
    *   *Nota: Debes ver el `index.html` directamente dentro de `web/gorilapp`.*

### 4. Configurar el Acceso (Virtual Host)
1.  Abre **Web Station**.
2.  Ve a **Portal de Servicios Web** (o "Virtual Host").
3.  Haz clic en **Crear**.
4.  Selecciona **Portal de servicio web** (o Host Virtual basado en puerto/nombre).
5.  Configuración:
    *   **Directorio raíz**: Selecciona `web/gorilapp`.
    *   **Servidor HTTP**: Apache HTTP Server 2.4.
    *   **PHP**: No configurado (no lo necesitamos).
    *   **Puerto**: Elige un puerto (ej. `8080`) o un nombre de dominio si tienes DDNS configurado (ej. `gorilapp.tumismo.synology.me`).

### 5. Solucionar Recarga de Páginas (SPA)
Como esta es una aplicación moderna (React), si entras en una sub-página y recargas, podrías recibir un error 404. Para arreglarlo:

1.  Crea un archivo de texto llamado `.htaccess` en tu ordenador.
2.  Pega el siguiente contenido:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

3.  Sube este archivo `.htaccess` a la carpeta `web/gorilapp` en tu NAS (junto al `index.html`).

---

## 🚀 ¡Listo!
Ahora puedes acceder a GorilApp desde cualquier dispositivo en tu red local:
`http://IP-DE-TU-NAS:8080` (o el puerto que hayas elegido).

Al ser una **PWA**, si accedes desde el móvil, podrás darle a "Añadir a pantalla de inicio" para instalarla como una App nativa.
