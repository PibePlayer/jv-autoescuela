# 🚗 JV Autoescuela Hurlingham - Web Application

Aplicación web oficial para **JV Autoescuela**, la academia de conductores líder en Hurlingham (Provincia de Buenos Aires, Argentina), ubicada en **Av. Gobernador Vergara 3855**.

Diseñada con un estándar visual moderno, responsive y de alto rendimiento, lista para desplegar en **Cloudflare Workers / Cloudflare Pages**.

---

## 🌟 Características Principales

1. **Identidad Visual y Flota Propia:**
   - Logo oficial de JV Autoescuela y autos de enseñanza con **doble pedalera homologada**.
   - Fotografías e ilustraciones de alta fidelidad: vehículos de enseñanza, camiones de carga pesada, colectivos urbanos, circuito de motos y puesto de mando pedagógico.

2. **Propuesta de Valor & Comparativa con el Municipio:**
   - Información verídica y transparente: mientras los cursos municipales tienen cupos limitados y listas de espera de varios meses, en JV comenzás tus prácticas en **24 a 48 hs**.
   - Amplitud horaria de lunes a sábados, variedad de categorías (automático, motos de alta cilindrada, camiones y colectivos) y opción de alquilar el vehículo de enseñanza para rendir el examen práctico en pista con acompañamiento.

3. **Flota Completa y Múltiples Categorías:**
   - **Auto Manual:** Práctica con doble pedalera para dominar embrague, cambios y estacionamiento.
   - **Auto Automático:** Conducción ágil y sin estrés, ideal para superar temores al volante.
   - **Motos (Todas las Cilindradas):** Categorías A.1.1 a A.1.4 (desde 110cc hasta alta cilindrada) en circuito reglamentario de conos.
   - **Camiones de Gran Porte (Cat. C):** Formación especializada en camiones de gran porte y logística pesada (~$400.000 / hora o módulo de práctica).
   - **Colectivos (Cat. D):** Capacitación para transporte de pasajeros y choferes profesionales.

4. **Sistema de Turnos & Reserva Online (Google Calendar Ready):**
   - Asistente paso a paso interactivo (Wizard).
   - Selección de vehículo, nivel, día y franja horaria.
   - **Botón de sincronización directa a Google Calendar** con evento pre-configurado y recordatorios.
   - Descarga de archivo `.ics` para Apple Calendar y Outlook.
   - Despacho automático de comprobante por WhatsApp al **11-6817-2577**.

5. **Cotizador Interactivo & Compra Online:**
   - Selector dinámico de packs (Clase individual, 4 clases, 6 clases o Curso Completo de 10 clases) y adicionales (alquiler de auto para examen oficial en pista, teórico vial bonificado).
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
