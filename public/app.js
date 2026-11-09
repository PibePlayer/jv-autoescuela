/**
 * JV Autoescuela Hurlingham - Interactive Application Logic
 * Soporta modo estático y modo Cloudflare Workers API
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFleetTabs();
  initCalculator();
  initBookingWizard();
  initQuiz();
  initFaqAccordion();
  initCheckoutModal();
  initContactForm();
  setCurrentYear();
});

function setCurrentYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ==========================================================================
   Toast Notifications Utility
   ========================================================================== */
function showToast(message, icon = '🚗') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   Mobile Drawer Menu
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const close = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    drawer.classList.add('open');
  });

  if (close) {
    close.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  }

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  });
}

/* ==========================================================================
   Flota y Categorías (Tabs Interactivas)
   ========================================================================== */
function initFleetTabs() {
  const tabs = document.querySelectorAll('.fleet-tab');
  const panels = document.querySelectorAll('.fleet-panel');
  const bookBtns = document.querySelectorAll('.btn-book-category');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;

      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const activePanel = document.getElementById(`panel-${target}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  // Botones dentro de los paneles que preseleccionan la categoría en el wizard
  bookBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      const radio = document.querySelector(`input[name="reservaVehiculo"][value="${cat}"]`);
      if (radio) {
        radio.checked = true;
      }
    });
  });
}

/* ==========================================================================
   Cotizador Interactivo de Cursos & Precios
   ========================================================================== */
const PRECIOS_BASE = {
  manual: { nombre: 'Gol Rojo (Manual)', porClase: 26000 },
  automatico: { nombre: 'Auto Automático', porClase: 29000 },
  moto: { nombre: 'Moto (Todas Cilindradas)', porClase: 22000 },
  camion: { nombre: 'Camión (Cat. C)', porClase: 42000 },
  colectivo: { nombre: 'Colectivo (Cat. D)', porClase: 45000 },
};

let currentQuote = {
  vehiculo: 'manual',
  clases: 10,
  incluyeExamen: true,
  subtotal: 260000,
  examen: 48000,
  total: 308000,
  efectivo: 261800,
  cuota3: 102666,
  cuota6: 55440,
};

function formatARS(num) {
  return '$' + num.toLocaleString('es-AR');
}

function initCalculator() {
  const chips = document.querySelectorAll('#calcVehiculoChips .chip');
  const slider = document.getElementById('clasesRange');
  const clasesPill = document.getElementById('clasesValue');
  const chkExamen = document.getElementById('chkExamen');
  const btnWhatsapp = document.getElementById('btnCotizarWhatsapp');

  function updateCalculation() {
    const vehiculoKey = currentQuote.vehiculo;
    const clasesCount = parseInt(slider.value, 10);
    const hasExamen = chkExamen.checked;

    currentQuote.clases = clasesCount;
    currentQuote.incluyeExamen = hasExamen;

    const base = PRECIOS_BASE[vehiculoKey] || PRECIOS_BASE.manual;
    const subtotal = base.porClase * clasesCount;
    const costoExamen = hasExamen ? 48000 : 0;
    const total = subtotal + costoExamen;
    const efectivo = Math.round(total * 0.85);
    const ahorro = total - efectivo;
    const cuota3 = Math.round(total / 3);
    const cuota6 = Math.round((total * 1.08) / 6);

    currentQuote.subtotal = subtotal;
    currentQuote.examen = costoExamen;
    currentQuote.total = total;
    currentQuote.efectivo = efectivo;
    currentQuote.cuota3 = cuota3;
    currentQuote.cuota6 = cuota6;

    // Actualizar UI
    if (clasesPill) clasesPill.textContent = `${clasesCount} Clases`;
    const summaryVehiculoLabel = document.getElementById('summaryVehiculoLabel');
    if (summaryVehiculoLabel) {
      summaryVehiculoLabel.textContent = `${base.nombre} (${clasesCount} clases)`;
    }

    const summarySubtotal = document.getElementById('summarySubtotal');
    if (summarySubtotal) summarySubtotal.textContent = formatARS(subtotal);

    const rowExamen = document.getElementById('summaryRowExamen');
    if (rowExamen) {
      rowExamen.style.display = hasExamen ? 'flex' : 'none';
    }

    const totalLista = document.getElementById('totalLista');
    if (totalLista) totalLista.textContent = formatARS(total);

    const totalEfectivo = document.getElementById('totalEfectivo');
    if (totalEfectivo) totalEfectivo.textContent = formatARS(efectivo);

    const ahorroText = document.getElementById('ahorroText');
    if (ahorroText) ahorroText.textContent = formatARS(ahorro);

    const cuota3Text = document.getElementById('cuota3Text');
    if (cuota3Text) cuota3Text.textContent = `${formatARS(cuota3)} /mes`;

    const cuota6Text = document.getElementById('cuota6Text');
    if (cuota6Text) cuota6Text.textContent = `${formatARS(cuota6)} /mes`;
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      currentQuote.vehiculo = chip.dataset.val;
      updateCalculation();
    });
  });

  if (slider) {
    slider.addEventListener('input', updateCalculation);
  }

  if (chkExamen) {
    chkExamen.addEventListener('change', updateCalculation);
  }

  if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', () => {
      const vNombre = PRECIOS_BASE[currentQuote.vehiculo].nombre;
      const text =
        `¡Hola JV Autoescuela! 🚗 Armé un presupuesto personalizado desde la web:\n\n` +
        `• *Vehículo:* ${vNombre}\n` +
        `• *Cantidad de clases:* ${currentQuote.clases} clases prácticas\n` +
        `• *Acompañamiento a examen:* ${currentQuote.incluyeExamen ? 'Sí' : 'No'}\n` +
        `• *Precio de lista:* ${formatARS(currentQuote.total)}\n` +
        `• *Precio en Efectivo / Transferencia (15% OFF):* ${formatARS(currentQuote.efectivo)}\n` +
        `• *Opción cuotas:* 3 de ${formatARS(currentQuote.cuota3)} o 6 de ${formatARS(currentQuote.cuota6)}\n\n` +
        `¿Qué días y horarios tienen disponibles para comenzar?`;

      window.open(`https://wa.me/5491168172577?text=${encodeURIComponent(text)}`, '_blank');
    });
  }

  updateCalculation();
}

/* ==========================================================================
   Checkout Modal (Compra Online)
   ========================================================================== */
function initCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  const btnOpen = document.getElementById('btnComprarOnline');
  const btnClose = document.getElementById('checkoutClose');
  const form = document.getElementById('checkoutForm');

  if (!modal || !btnOpen) return;

  btnOpen.addEventListener('click', () => {
    // Cargar datos actuales de la cotización
    const vNombre = PRECIOS_BASE[currentQuote.vehiculo].nombre;
    const orderItemTitle = document.getElementById('orderItemTitle');
    const orderItemPrice = document.getElementById('orderItemPrice');
    const orderExamenRow = document.getElementById('orderExamenRow');
    const orderTotal = document.getElementById('orderTotal');
    const mpCuotaAmount = document.getElementById('mpCuotaAmount');
    const transfAmount = document.getElementById('transfAmount');

    if (orderItemTitle) orderItemTitle.textContent = `Pack ${currentQuote.clases} Clases - ${vNombre}`;
    if (orderItemPrice) orderItemPrice.textContent = formatARS(currentQuote.subtotal);
    if (orderExamenRow) orderExamenRow.style.display = currentQuote.incluyeExamen ? 'flex' : 'none';
    if (orderTotal) orderTotal.textContent = formatARS(currentQuote.total);
    if (mpCuotaAmount) mpCuotaAmount.textContent = formatARS(currentQuote.cuota6);
    if (transfAmount) transfAmount.textContent = formatARS(currentQuote.efectivo);

    modal.classList.add('open');
  });

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('coNombre').value;
      const email = document.getElementById('coEmail').value;
      const dni = document.getElementById('coDni').value;
      const metodo = document.querySelector('input[name="payMethod"]:checked').value;

      modal.classList.remove('open');

      showToast(`¡Excelente ${nombre}! Te estamos redirigiendo a Mercado Pago para abonar tu curso.`);

      // Si es transferencia o mercado pago, notificar a WhatsApp con el checkout
      const vNombre = PRECIOS_BASE[currentQuote.vehiculo].nombre;
      const montoFinal = metodo === 'transferencia' ? formatARS(currentQuote.efectivo) : formatARS(currentQuote.total);
      const text =
        `¡Hola JV Autoescuela! 🛒 Acabo de generar una orden de compra online:\n\n` +
        `👤 *Alumno:* ${nombre} (DNI: ${dni})\n` +
        `📧 *Email:* ${email}\n` +
        `🚘 *Curso:* ${currentQuote.clases} clases en ${vNombre}\n` +
        `💳 *Método elegido:* ${metodo === 'transferencia' ? 'Transferencia (15% OFF)' : 'Mercado Pago en Cuotas'}\n` +
        `💰 *Monto:* ${montoFinal}\n\n` +
        `Solicito los datos para abonar y agendar mis primeras clases.`;

      setTimeout(() => {
        window.open(`https://wa.me/5491168172577?text=${encodeURIComponent(text)}`, '_blank');
      }, 1200);
    });
  }
}

/* ==========================================================================
   Booking Wizard (Reserva de Turnos & Sincronización Google Calendar)
   ========================================================================== */
function initBookingWizard() {
  const pane1 = document.getElementById('paneStep1');
  const pane2 = document.getElementById('paneStep2');
  const pane3 = document.getElementById('paneStep3');
  const pane4 = document.getElementById('paneStep4');

  const ind1 = document.getElementById('stepIndicator1');
  const ind2 = document.getElementById('stepIndicator2');
  const ind3 = document.getElementById('stepIndicator3');
  const ind4 = document.getElementById('stepIndicator4');

  const btnNext1 = document.getElementById('btnNext1');
  const btnNext2 = document.getElementById('btnNext2');
  const btnBack2 = document.getElementById('btnBack2');
  const btnBack3 = document.getElementById('btnBack3');
  const bookingForm = document.getElementById('bookingForm');
  const btnNewBooking = document.getElementById('btnNewBooking');

  // Inicializar fecha mínima en el selector (mañana)
  const fechaInput = document.getElementById('reservaFecha');
  if (fechaInput) {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Desde mañana
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    fechaInput.min = `${yyyy}-${mm}-${dd}`;
    fechaInput.value = `${yyyy}-${mm}-${dd}`;
  }

  function setStep(step) {
    [pane1, pane2, pane3, pane4].forEach((p) => p && p.classList.remove('active'));
    [ind1, ind2, ind3, ind4].forEach((i) => i && i.classList.remove('active'));

    if (step === 1) {
      pane1.classList.add('active');
      ind1.classList.add('active');
    } else if (step === 2) {
      pane2.classList.add('active');
      ind1.classList.add('active');
      ind2.classList.add('active');
    } else if (step === 3) {
      pane3.classList.add('active');
      ind1.classList.add('active');
      ind2.classList.add('active');
      ind3.classList.add('active');
    } else if (step === 4) {
      pane4.classList.add('active');
      ind1.classList.add('active');
      ind2.classList.add('active');
      ind3.classList.add('active');
      ind4.classList.add('active');
    }
  }

  if (btnNext1) {
    btnNext1.addEventListener('click', () => setStep(2));
  }

  if (btnBack2) {
    btnBack2.addEventListener('click', () => setStep(1));
  }

  if (btnNext2) {
    btnNext2.addEventListener('click', () => {
      const fechaVal = fechaInput ? fechaInput.value : '';
      if (!fechaVal) {
        alert('Por favor seleccioná una fecha para tu clase.');
        return;
      }
      setStep(3);
    });
  }

  if (btnBack3) {
    btnBack3.addEventListener('click', () => setStep(2));
  }

  if (btnNewBooking) {
    btnNewBooking.addEventListener('click', () => {
      bookingForm.reset();
      setStep(1);
    });
  }

  // Enviar Reserva
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const vehiculo = document.querySelector('input[name="reservaVehiculo"]:checked').value;
      const nivel = document.getElementById('reservaNivel').value;
      const fecha = document.getElementById('reservaFecha').value;
      const hora = document.querySelector('input[name="reservaHora"]:checked').value;
      const instructor = document.getElementById('reservaInstructor').value;
      const nombre = document.getElementById('alumnoNombre').value;
      const telefono = document.getElementById('alumnoTelefono').value;
      const email = document.getElementById('alumnoEmail').value;
      const municipio = document.getElementById('alumnoMunicipio').value;

      const bookingPayload = {
        nombre,
        telefono,
        email,
        vehiculo,
        fecha,
        hora,
        instructor,
        nivel,
        municipio,
      };

      let bookingId = 'JV-' + Math.floor(100000 + Math.random() * 900000);
      let gcalUrl = '';
      let waUrl = '';

      // Intentar llamar a la API del Worker
      try {
        const res = await fetch('/api/reserva', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingPayload),
        });

        if (res.ok) {
          const data = await res.json();
          bookingId = data.bookingId;
          gcalUrl = data.googleCalendarUrl;
          waUrl = data.whatsappUrl;
        } else {
          throw new Error('API offline');
        }
      } catch (err) {
        // Fallback robusto en el cliente (si se corre como archivo estático local sin backend)
        const dateParts = fecha.split('-');
        const hourParts = hora.split(':');
        const start = new Date(
          Date.UTC(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2]),
            parseInt(hourParts[0]) + 3,
            parseInt(hourParts[1])
          )
        );
        const end = new Date(start.getTime() + 60 * 60 * 1000);

        const formatIso = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const title = encodeURIComponent(`Clase de Manejo (${vehiculo.toUpperCase()}) - JV Autoescuela Hurlingham`);
        const details = encodeURIComponent(
          `Turno Agendado con JV Autoescuela Hurlingham.\n` +
          `Reserva: #${bookingId}\n` +
          `Alumno: ${nombre}\n` +
          `Vehículo: ${vehiculo}\n` +
          `Instructor: ${instructor}\n\n` +
          `Dirección: Av. Gobernador Vergara 3855, Hurlingham\n` +
          `Tel: 11-6817-2577`
        );
        const loc = encodeURIComponent('Av. Gobernador Vergara 3855, Hurlingham, Buenos Aires');
        gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatIso(start)}/${formatIso(end)}&details=${details}&location=${loc}`;

        const waMsg = encodeURIComponent(
          `¡Hola JV Autoescuela! 🚗 Acabo de reservar mi clase de manejo online:\n\n` +
          `📋 *Reserva:* #${bookingId}\n` +
          `👤 *Alumno:* ${nombre}\n` +
          `📅 *Día:* ${fecha} a las ${hora} hs\n` +
          `🚘 *Vehículo:* ${vehiculo}\n` +
          `📱 *WhatsApp:* ${telefono}\n\n` +
          `Quisiera confirmar el turno y coordinar el pago. ¡Muchas gracias!`
        );
        waUrl = `https://wa.me/5491168172577?text=${waMsg}`;
      }

      // Actualizar UI del ticket de confirmación
      document.getElementById('ticketCode').textContent = `Reserva #${bookingId}`;
      document.getElementById('ticketNombre').textContent = nombre;
      document.getElementById('ticketVehiculo').textContent = PRECIOS_BASE[vehiculo]?.nombre || vehiculo;
      document.getElementById('ticketFechaHora').textContent = `${fecha} a las ${hora} hs`;

      // Configurar botones de acción
      const btnGCal = document.getElementById('btnGCalSync');
      if (btnGCal) btnGCal.href = gcalUrl;

      const btnWa = document.getElementById('btnWaConfirmBooking');
      if (btnWa) btnWa.href = waUrl;

      // Configurar descarga de archivo .ics
      const btnIcs = document.getElementById('btnDownloadIcs');
      if (btnIcs) {
        btnIcs.onclick = () => {
          generateIcsDownload(bookingPayload, bookingId);
        };
      }

      setStep(4);
      showToast('¡Turno pre-agendado! Ya podés sincronizarlo con Google Calendar.', '📅');
    });
  }
}

// Generador de archivo .ics para Apple Calendar / Outlook / Móvil
function generateIcsDownload(b, id) {
  const dateFormatted = b.fecha.replace(/-/g, '');
  const hourClean = b.hora.replace(':', '');
  const dtStart = `${dateFormatted}T${hourClean}00`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//JV Autoescuela Hurlingham//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${id}@jvautoescuela.com.ar`,
    `SUMMARY:Clase de Manejo (${b.vehiculo.toUpperCase()}) - JV Autoescuela`,
    `DESCRIPTION:Clase de manejo en JV Autoescuela Hurlingham. Alumno: ${b.nombre}. Reserva #${id}`,
    'LOCATION:Av. Gobernador Vergara 3855, Hurlingham, Buenos Aires',
    `DTSTART;TZID=America/Argentina/Buenos_Aires:${dtStart}`,
    `DTEND;TZID=America/Argentina/Buenos_Aires:${dateFormatted}T${parseInt(hourClean) + 100}00`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `clase_jv_autoescuela_${id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Archivo de calendario .ics descargado.');
}

/* ==========================================================================
   Simulador de Examen Teórico (Hurlingham & Provincia de Buenos Aires)
   ========================================================================== */
const QUIZ_DATA = [
  {
    pregunta: 'En la rotonda de Av. Gobernador Vergara, ¿quién tiene prioridad de paso por normativa general de tránsito?',
    opciones: [
      'El vehículo que circula dentro de la rotonda tiene prioridad sobre el que intenta ingresar.',
      'El vehículo que circula a mayor velocidad.',
      'El vehículo que ingresa desde la derecha, sin importar si el otro ya está adentro.',
      'Siempre el colectivo o vehículo de mayor porte.',
    ],
    correcta: 0,
    explicacion:
      'Ley Nacional y Provincial de Tránsito: Quien circula por la calzada circular (dentro de la rotonda) tiene siempre prioridad sobre quien pretende acceder a ella.',
  },
  {
    pregunta: '¿Cuál es la velocidad máxima permitida en avenidas del Partido de Hurlingham, salvo señalización que indique lo contrario?',
    opciones: [
      '40 km/h',
      '60 km/h',
      '70 km/h',
      '80 km/h',
    ],
    correcta: 1,
    explicacion:
      'En avenidas urbanas la velocidad máxima reglamentaria es de 60 km/h, mientras que en calles de barrio es de 40 km/h y en zonas escolares 20 km/h.',
  },
  {
    pregunta: 'Al realizar la maniobra de estacionamiento paralelo en el circuito de examen, ¿cuál es la distancia máxima reglamentaria respecto al cordón?',
    opciones: [
      'Menos de 10 cm pegado a la vereda.',
      'Entre 20 y 30 cm de la vereda, sin golpear el cordón ni tocar los conos/vallas.',
      'A más de 50 cm para que no raspe las cubiertas.',
      'No importa la distancia mientras no toque los otros autos.',
    ],
    correcta: 1,
    explicacion:
      'En el examen práctico oficial de Hurlingham se evalúa dejar el vehículo entre 20 y 30 cm del cordón, paralelo y en hasta 3 maniobras continuas sin golpear.',
  },
  {
    pregunta: '¿Cuál es el límite legal de tolerancia de alcohol en sangre para conductores particulares en la Provincia de Buenos Aires?',
    opciones: [
      '0,5 gramos por litro de sangre.',
      '0,2 gramos por litro de sangre.',
      'Alcohol Cero (0,0 gramos por litro de sangre).',
      'Solo se sanciona a los choferes profesionales de colectivos y camiones.',
    ],
    correcta: 2,
    explicacion:
      'Por la Ley de Alcohol Cero de la Provincia de Buenos Aires, rige tolerancia CERO (0,0 g/l) para todo tipo de vehículos y conductores.',
  },
  {
    pregunta: 'Si se aproxima a una intersección sin semáforos, ¿quién goza de la prioridad de paso?',
    opciones: [
      'El vehículo que asoma la trompa primero.',
      'El vehículo que circula por la vía de la izquierda.',
      'El vehículo que se presenta desde la derecha, siempre que no haya señal de ceda el paso o vía de mayor jerarquía.',
      'El vehículo que toca bocina con anterioridad.',
    ],
    correcta: 2,
    explicacion:
      'La prioridad absoluta de la derecha es fundamental en la conducción urbana. En JV reforzamos esta precaución defensiva en cada esquina.',
  },
];

let quizIndex = 0;
let quizScore = 0;

function initQuiz() {
  renderQuestion();

  const btnNext = document.getElementById('btnNextQuestion');
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      quizIndex++;
      if (quizIndex < QUIZ_DATA.length) {
        renderQuestion();
      } else {
        showQuizResult();
      }
    });
  }
}

function renderQuestion() {
  const q = QUIZ_DATA[quizIndex];
  const qNum = document.getElementById('quizQNum');
  const qText = document.getElementById('quizQuestion');
  const optionsContainer = document.getElementById('quizOptions');
  const feedback = document.getElementById('quizFeedback');
  const progress = document.getElementById('quizProgress');
  const scoreBadge = document.getElementById('quizScoreBadge');

  if (!qText || !optionsContainer) return;

  if (qNum) qNum.textContent = `Pregunta ${quizIndex + 1} de ${QUIZ_DATA.length}`;
  if (qText) qText.textContent = q.pregunta;
  if (progress) progress.style.width = `${((quizIndex + 1) / QUIZ_DATA.length) * 100}%`;
  if (scoreBadge) scoreBadge.textContent = `Puntaje: ${quizScore}`;
  if (feedback) feedback.style.display = 'none';

  optionsContainer.innerHTML = '';

  q.opciones.forEach((optText, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quiz-opt-btn';
    btn.textContent = optText;

    btn.addEventListener('click', () => {
      handleAnswer(idx, q.correcta, q.explicacion);
    });

    optionsContainer.appendChild(btn);
  });
}

function handleAnswer(selected, correct, explicacion) {
  const options = document.querySelectorAll('.quiz-opt-btn');
  options.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correct) {
      btn.classList.add('correct');
    }
    if (idx === selected && selected !== correct) {
      btn.classList.add('incorrect');
    }
  });

  const feedback = document.getElementById('quizFeedback');
  const fbTitle = document.getElementById('feedbackTitle');
  const fbText = document.getElementById('feedbackText');

  if (selected === correct) {
    quizScore++;
    fbTitle.textContent = '✅ ¡Respuesta Correcta!';
    fbTitle.style.color = 'var(--success-dark)';
  } else {
    fbTitle.textContent = '❌ Respuesta Incorrecta';
    fbTitle.style.color = '#DC2626';
  }

  fbText.textContent = explicacion;
  feedback.style.display = 'block';

  const scoreBadge = document.getElementById('quizScoreBadge');
  if (scoreBadge) scoreBadge.textContent = `Puntaje: ${quizScore}`;
}

function showQuizResult() {
  const quizCard = document.getElementById('quizCard');
  const resultCard = document.getElementById('quizResultCard');
  const resultScore = document.getElementById('resultScore');
  const resultTitle = document.getElementById('resultTitle');
  const resultText = document.getElementById('resultText');

  if (quizCard) quizCard.style.display = 'none';
  if (resultCard) resultCard.style.display = 'block';

  if (resultScore) resultScore.textContent = `${quizScore} / ${QUIZ_DATA.length}`;

  if (quizScore >= 4) {
    resultTitle.textContent = '🎉 ¡Felicitaciones! Tenés excelente criterio vial';
    resultText.textContent = 'Tenés la teoría muy clara. Ahora animate a dar el salto a la práctica en la calle con nosotros.';
  } else {
    resultTitle.textContent = '📚 ¡Buen intento! La teoría se afianza en la práctica';
    resultText.textContent = 'No te preocupes: en JV Autoescuela te incluimos el curso teórico completo y simuladores para que rindas 10 puntos.';
  }
}

/* ==========================================================================
   Preguntas Frecuentes (FAQ Accordion)
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Cerrar otros
        items.forEach((other) => {
          if (other !== item) {
            other.classList.remove('active');
            const otherAns = other.querySelector('.faq-answer');
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });
}

/* ==========================================================================
   Formulario de Contacto Rápido
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('cNombre').value;
    const tel = document.getElementById('cTel').value;
    const interes = document.getElementById('cInteres').value;
    const msg = document.getElementById('cMensaje').value;

    const waMsg = encodeURIComponent(
      `¡Hola JV Autoescuela! 📬 Mensaje de contacto desde la web:\n\n` +
      `👤 *Nombre:* ${nombre}\n` +
      `📞 *Teléfono:* ${tel}\n` +
      `🚗 *Interés:* ${interes}\n` +
      `💬 *Consulta:* ${msg || 'Quisiera coordinar una entrevista o llamada informativa.'}`
    );

    showToast('¡Mensaje enviado! Te respondemos a la brevedad por WhatsApp.');
    form.reset();

    setTimeout(() => {
      window.open(`https://wa.me/5491168172577?text=${waMsg}`, '_blank');
    }, 1000);
  });
}
