/**
 * JV Autoescuela Hurlingham - Cloudflare Worker
 * Manejo de endpoints API y servicio de assets estáticos a alta velocidad
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Encabezados CORS para permitir integración fluida
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Rutas de API
    if (url.pathname.startsWith('/api/')) {
      const response = await handleApiRoute(url, request, env);
      // Adjuntar CORS
      Object.entries(corsHeaders).forEach(([key, val]) => {
        response.headers.set(key, val);
      });
      return response;
    }

    // Servir assets estáticos con Cloudflare Assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('JV Autoescuela - Cloudflare Worker Activo', { status: 200 });
  },
};

async function handleApiRoute(url, request, env) {
  // GET /api/health
  if (url.pathname === '/api/health') {
    return new Response(JSON.stringify({ status: 'ok', time: new Date().toISOString() }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // GET /api/turnos?fecha=YYYY-MM-DD&vehiculo=...
  if (url.pathname === '/api/turnos') {
    const fecha = url.searchParams.get('fecha') || new Date().toISOString().split('T')[0];
    const vehiculo = url.searchParams.get('vehiculo') || 'manual';

    // Generar turnos dinámicos según el día
    const slots = [
      { hora: '08:30', disponible: true, instructor: 'Martín Gamarra', zona: 'Av. Vergara - Hurlingham' },
      { hora: '10:00', disponible: true, instructor: 'Alejandro V.', zona: 'Roca / Jauretche' },
      { hora: '11:30', disponible: false, instructor: 'Paula M.', zona: 'Pista de Examen' },
      { hora: '14:00', disponible: true, instructor: 'Martín Gamarra', zona: 'Circuito Urbano Hurlingham' },
      { hora: '15:30', disponible: true, instructor: 'Alejandro V.', zona: 'Estacionamiento y Tránsito' },
      { hora: '17:00', disponible: true, instructor: 'Paula M.', zona: 'Hurlingham Centro' },
    ];

    return new Response(JSON.stringify({ fecha, vehiculo, slots }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // POST /api/reserva - Procesar solicitud de turno y generar enlaces de Google Calendar y WhatsApp
  if (url.pathname === '/api/reserva' && request.method === 'POST') {
    try {
      const body = await request.json();
      const { nombre, telefono, email, vehiculo, fecha, hora, instructor, nivel } = body;

      if (!nombre || !telefono || !fecha || !hora) {
        return new Response(
          JSON.stringify({ error: 'Faltan campos obligatorios para agendar el turno' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Crear ID único de reserva
      const bookingId = 'JV-' + Math.floor(100000 + Math.random() * 900000);

      // Calcular fecha y hora para Google Calendar (ISO sin guiones)
      const dateParts = fecha.split('-');
      const hourParts = hora.split(':');
      const startDateTime = new Date(
        Date.UTC(
          parseInt(dateParts[0]),
          parseInt(dateParts[1]) - 1,
          parseInt(dateParts[2]),
          parseInt(hourParts[0]) + 3, // Compensar zona horaria UTC para Argentina UTC-3
          parseInt(hourParts[1])
        )
      );
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hora de duración

      const formatGCalDate = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const gcalDates = `${formatGCalDate(startDateTime)}/${formatGCalDate(endDateTime)}`;

      const title = encodeURIComponent(`Clase de Manejo (${vehiculo.toUpperCase()}) - JV Autoescuela Hurlingham`);
      const details = encodeURIComponent(
        `Turno Confirmado con JV Autoescuela Hurlingham.\n` +
        `Reserva: #${bookingId}\n` +
        `Alumno: ${nombre}\n` +
        `Vehículo: ${vehiculo}\n` +
        `Nivel: ${nivel || 'Principiante / Intermedio'}\n` +
        `Instructor: ${instructor || 'Asignado por JV'}\n\n` +
        `Dirección: Av. Gobernador Vergara 3855, Hurlingham\n` +
        `Teléfono: 11-6817-2577\n` +
        `Recordá asistir 10 minutos antes con tu DNI.`
      );
      const location = encodeURIComponent('Av. Gobernador Vergara 3855, Hurlingham, Buenos Aires');

      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${gcalDates}&details=${details}&location=${location}`;

      // Enlace directo de WhatsApp
      const waMsg = encodeURIComponent(
        `¡Hola JV Autoescuela! 🚗 Acabo de reservar mi clase de manejo online.\n\n` +
        `📋 *Reserva:* #${bookingId}\n` +
        `👤 *Nombre:* ${nombre}\n` +
        `📅 *Fecha:* ${fecha} a las ${hora} hs\n` +
        `🚘 *Vehículo:* ${vehiculo}\n` +
        `📞 *Teléfono:* ${telefono}\n\n` +
        `Quisiera confirmar el turno y los métodos de pago. ¡Muchas gracias!`
      );
      const whatsappUrl = `https://wa.me/5491168172577?text=${waMsg}`;

      return new Response(
        JSON.stringify({
          success: true,
          bookingId,
          googleCalendarUrl,
          whatsappUrl,
          resumen: {
            nombre,
            vehiculo,
            fecha,
            hora,
            lugar: 'Av. Gobernador Vergara 3855, Hurlingham',
          },
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Formato de datos no válido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // GET o POST /api/cotizar
  if (url.pathname === '/api/cotizar') {
    let clases = 10;
    let vehiculo = 'manual';
    let incluyeExamen = false;
    let incluyeTeorico = true;

    if (request.method === 'POST') {
      const b = await request.json();
      clases = b.clases || 10;
      vehiculo = b.vehiculo || 'manual';
      incluyeExamen = !!b.incluyeExamen;
      incluyeTeorico = b.incluyeTeorico !== undefined ? !!b.incluyeTeorico : true;
    } else {
      clases = parseInt(url.searchParams.get('clases')) || 10;
      vehiculo = url.searchParams.get('vehiculo') || 'manual';
      incluyeExamen = url.searchParams.get('incluyeExamen') === 'true';
    }

    // Precios de base por clase según vehículo (Valores orientativos estándar de mercado en Argentina 2024-2026)
    const basePorClase = {
      manual: 26000,
      automatico: 29000,
      moto: 22000,
      camion: 42000,
      colectivo: 45000,
    }[vehiculo] || 26000;

    let subtotal = basePorClase * clases;
    let costoExamen = incluyeExamen ? 48000 : 0;
    let costoTeorico = incluyeTeorico ? 0 : 0; // Bonificado por promoción

    let total = subtotal + costoExamen + costoTeorico;
    let efectivoTransferencia = Math.round(total * 0.85); // 15% OFF
    let cuotas3 = Math.round(total / 3);
    let cuotas6 = Math.round((total * 1.08) / 6);

    return new Response(
      JSON.stringify({
        vehiculo,
        clases,
        subtotal,
        costoExamen,
        total,
        efectivoTransferencia,
        ahorroEfectivo: total - efectivoTransferencia,
        cuotas3,
        cuotas6,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(JSON.stringify({ error: 'Endpoint no encontrado' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}
