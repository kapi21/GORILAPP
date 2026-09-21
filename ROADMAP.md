# 🗺️ GorilApp - Roadmap de Desarrollo

Plan de evolución técnica y funcional para futuras versiones de GorilApp.

---

## 📌 Fase 1: Estabilización, PWA y Acceso Remoto *(COMPLETADA)*
- [x] Corrección de carga y eliminación de bucles de inicialización Dexie DB.
- [x] Configuración de 4 sesiones fijas "Rutina Septiembre" sin duplicación.
- [x] Prevención universal de apagado de pantalla en móvil (`NoSleep.js` + `WakeLock API`).
- [x] Ajuste visual de layout y controles de repetición/peso para pantallas móviles estrechas.
- [x] Diseño deportivo Glassmorphism Pro con silueta de gorila y acento LED carmesí.
- [x] Soporte e instalación PWA con manifest y Service Worker offline.
- [x] Despliegue en contenedor LXC 111 de Proxmox con acceso seguro Tailscale y certificado Let's Encrypt.
- [x] Editor modal compacto para corregir series en caliente.

---

## 🚀 Fase 2: Analítica Deportiva y Métricas de Rendimiento *(Próxima Fase)*
- [ ] **Estimación de 1RM Automática**: Cálculo basado en las fórmulas de Brzycki y Epley a partir de series con RIR registrado.
- [ ] **Gráficas de Progresión por Ejercicio**: Visualización temporal de carga levantada y volumen total por sesión en `ProgressCharts.jsx`.
- [ ] **Volumen Semanal Efectivo**: Conteo de series efectivas (RIR ≤ 3) por grupo muscular acumuladas en la semana.
- [ ] **Récords Personales (PRs)**: Notificación visual destacada cuando se supera la mejor marca de un ejercicio.

---

## ⏱️ Fase 3: Temporizadores y Sonidos de Entrenamiento
- [ ] **Temporizador de Descanso Inteligente**: Inicio automático al registrar una serie con tiempo sugerido según el ejercicio (ej. 2' en multiarticulares, 90" en aislamiento).
- [ ] **Vibración Háptica en Móvil**: Patrón de vibración al finalizar el descanso para entrenar con auriculares o móvil en el bolsillo.
- [ ] **Sonidos Personalizados**: Selector de pitidos (beeps de CrossFit, gong o campana de boxeo).

---

## 🔄 Fase 4: Exportación y Gestión de Mesociclos
- [ ] **Exportación a CSV / Excel**: Descarga de registros históricos para análisis externo.
- [ ] **Gestor de Rutinas Personalizadas**: Interfaz para crear nuevos bloques (ej. "Rutina Octubre / Hipertrofia") y alternar entre ellos sin perder los anteriores.
- [ ] **Sincronización P2P o Nube Opcional**: Copia de seguridad automática cifrada hacia un bucket S3 o carpeta compartida de Proxmox/Synology.
