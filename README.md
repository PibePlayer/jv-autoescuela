# 🚗 JV Autoescuela Hurlingham - Web Application

Aplicación web oficial para **JV Autoescuela**, la academia de conductores líder y N°1 en Hurlingham (Provincia de Buenos Aires, Argentina), ubicada en **Av. Gobernador Vergara 3855**.

Diseñada con un estilo moderno, persuasivo y de alta conversión inspirado en *Driver's School*, optimizada específicamente para desplegar en **Cloudflare Workers**.

---

## 🌟 Características Principales

1. **Identidad Visual Realista y Emblemática:**
   - Destaca el reconocido **Volkswagen Gol Rojo ploteado con el logo oficial** y doble comando para la enseñanza práctica.
   - Fotografías de alta fidelidad integradas: Gol Rojo en las calles de Hurlingham, camiones de carga pesada, colectivos urbanos, pista de entrenamiento de motos y habitáculo con doble pedalera.

2. **Propuesta de Valor & Posicionamiento vs. Cursos Gratuitos de la Municipalidad:**
   - Sección comparativa contundente: *"¿Clases Gratuitas del Municipio o Autoescuela Profesional?"*
   - Demuestra por qué lo "gratis" termina saliendo caro (meses de espera, autos sin VTV/ex-patrulleros, falta de instructores matriculados, sin tránsito real) frente a las ventajas indiscutibles de JV Autoescuela (inicio en 24-48 hs, 100% tránsito real, seguro especial para el aprendiz, +96% de aprobación al primer intento).

3. **Flota Completa y Múltiples Categorías:**
   - **Auto Caja Manual:** El clásico Gol Rojo para dominar embrague y estacionamiento en 3 maniobras.
   - **Auto Caja Automática:** Manejo relajado, sin tirones, ideal para personas con amaxofobia / miedo al volante.
   - **Motos (Todas las Cilindradas):** Categorías A.1.1, A.1.2, A.1.3 y A.1.4 (desde 110cc hasta más de 300cc), con circuito oficial de conos y frenada combinada.
   - **Camiones de Gran Porte (Cat. C):** Formación para transporte de cargas generales y logística pesada con rápida salida laboral.
   - **Colectivos (Cat. D):** Capacitación integral para choferes de líneas urbanas e interurbanas.

4. **Sistema de Turnos & Reserva Online (Google Calendar Ready):**
   - Asistente paso a paso interactivo (Wizard).
   - Selección de vehículo, nivel, día y franja horaria.
   - **Botón de sincronización directa a Google Calendar** con evento pre-configurado y recordatorios.
   - Descarga de archivo `.ics` para Apple Calendar y Outlook.
   - Despacho automático de comprobante por WhatsApp al **11-6817-2577**.

5. **Cotizador Interactivo & Compra Online:**
   - Selector dinámico de cantidad de clases (de 5 a 20 clases) y adicionales (alquiler de auto para examen oficial en pista, teórico vial bonificado).
   - Cálculo automático de descuentos por pago en efectivo o transferencia (15% OFF) y facilidades en **3 y 6 cuotas con Mercado Pago**.
   - Modal de compra online integrado.

6. **Simulador de Examen Teórico de Tránsito (Hurlingham & PBA):**
   - Mini-test interactivo de 5 preguntas reales con feedback inmediato y explicaciones pedagógicas según la Ley de Tránsito.

7. **Prueba Social & Ubicación:**
   - Reseñas con calificación 4.8 / 5 ⭐ basadas en más de 250 opiniones reales en Google.
   - Datos oficiales de la sede: Av. Gobernador Vergara 3855, Hurlingham.

---

## 📁 Estructura del Proyecto

```
jv-autoescuela/
├── public/                     # Assets estáticos servidos en Cloudflare Workers
│   ├── images/                 # Fotografías del Gol Rojo, Camión/Colectivo, Motos
│   ├── index.html              # Landing page completa y responsive
│   ├── styles.css              # Sistema de diseño, tokens y media queries
│   └── app.js                  # Lógica interactiva de reservas, cotizador, quiz
├── src/
│   └── index.js                # Cloudflare Worker script con API REST (/api/turnos, /api/reserva, /api/cotizar)
├── server.js                   # Servidor de desarrollo local con Node.js
├── wrangler.toml               # Configuración oficial de Cloudflare Workers (Assets + Worker)
├── package.json
└── README.md
```

---

## 🚀 Despliegue en Cloudflare Workers

El proyecto está 100% configurado para la arquitectura moderna de **Cloudflare Workers con Static Assets**.

### 1. Iniciar sesión en Cloudflare (desde tu terminal)
```bash
npx wrangler login
```

### 2. Probar en entorno local de Cloudflare Workers
```bash
npm run cf:dev
# o bien: npx wrangler dev
```

### 3. Desplegar a producción en Cloudflare
```bash
npm run cf:deploy
# o bien: npx wrangler deploy
```

¡Listo! Cloudflare compilará y desplegará tu web en más de 300 centros de datos mundiales, logrando tiempos de carga menores a 50ms en Hurlingham y toda Argentina.

---

## 💻 Ejecución Local Rápida (Sin dependencias externas)

Podés correr el servidor localmente con Node.js estándar:

```bash
npm run dev
```

Abrí en tu navegador: `http://localhost:3000`
