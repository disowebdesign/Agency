import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initNav } from './nav.js'
gsap.registerPlugin(ScrollTrigger)

// ─── LENIS ─────────────────────────────────────────────
const lenis = new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
function raf(time) { lenis.raf(time); requestAnimationFrame(raf) }
requestAnimationFrame(raf)

// Conectar Lenis con ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => { lenis.raf(time * 1000) })
gsap.ticker.lagSmoothing(0)

// ─── MAIN TIMELINE ─────────────────────────────────────
const tl = gsap.timeline()

// Loader letras
tl.to('.logo-letter', { opacity:1, duration:0.05, stagger:0.12, ease:'power2.out' }, 0.3)
  .to('.loader-subtitle', { opacity:1, duration:0.6, ease:'power2.out' }, 0.9)
  .to('.loader-line', { width:180, duration:0.8, ease:'power3.out' }, 1.0)
  .to({}, { duration: 0.9 })

// Cortinas loader
  .to('.loader-curtain-left',  { scaleX:1, duration:0.7, ease:'power4.inOut', transformOrigin:'left center' }, '+=0.1')
  .to('.loader-curtain-right', { scaleX:1, duration:0.7, ease:'power4.inOut', transformOrigin:'right center' }, '<')
  .to('#loader', { opacity:0, duration:0.3, onComplete: () => document.getElementById('loader').style.display='none' })

// Navbar
  .to('#navbar', { opacity:1, duration:0.8, ease:'power2.out' }, '-=0.1')
  .call(() => initNav())

// REVEAL imagen hero — cortina sube
  .to('.hero-img-reveal .img-curtain', {
    scaleY: 0, duration: 1.1, ease: 'power4.inOut', transformOrigin: 'bottom',
  }, '-=0.4')

// Tagline
  .to('.hero-tagline', { opacity:1, duration:0.6, ease:'power2.out' }, '-=0.5')

// Servicios en stagger — como el título del DON
  .to('.svc-item', {
    opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power4.out',
  }, '-=0.3')

// Panel derecho
  .to('.hip-products-label', { opacity:1, y:0, duration:0.7, ease:'power2.out' }, '-=0.6')
  .to('.hip-card', { opacity:1, y:0, duration:0.8, ease:'power3.out' }, '-=0.4')

// REVEAL imagen producto
  .to('.product-img-reveal .img-curtain', {
    scaleY: 0, duration: 1.0, ease: 'power4.inOut', transformOrigin: 'bottom',
  }, '-=0.5')

  .to('.hip-learn-more', { opacity:1, y:0, duration:0.6, ease:'power2.out' }, '-=0.3')
  .to('.hip-divider',    { opacity:1, duration:0.5 }, '-=0.3')
  .to('.hip-ticker-wrap',{ opacity:1, y:0, duration:0.7, ease:'power2.out' }, '-=0.3')

// ─── PARALLAX ──────────────────────────────────────────
const heroBg = document.querySelector('.hero-photo-bg')
window.addEventListener('mousemove', (e) => {
  gsap.to(heroBg, {
    x: (e.clientX / window.innerWidth - 0.5) * 14,
    y: (e.clientY / window.innerHeight - 0.5) * 10,
    duration: 1.8, ease: 'power1.out',
  })
})

// ─── CORNERS BREATHE ───────────────────────────────────
gsap.to('.frame-corner', { opacity:0.8, duration:2, yoyo:true, repeat:-1, ease:'sine.inOut', stagger:0.5 })

// ─── EQUIPO: scroll pinneado — foto centrada + nombre gigante ───

function easeOut(t) { return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3) }
function easeIn(t)  { return Math.pow(Math.min(1, Math.max(0, t)), 2) }

const slides      = gsap.utils.toArray('.equipo-slide')
const totalSlides = slides.length

slides.forEach((slide, i) => {
  const photo      = slide.querySelector('.slide-photo')
  const bgNombre   = slide.querySelector('.slide-bg-nombre')
  const bgApellido = slide.querySelector('.slide-bg-apellido')
  const topInfo    = slide.querySelector('.slide-top-info')
  const bottomInfo = slide.querySelector('.slide-bottom-info')

  const segmentSize = 1 / totalSlides
  const start       = i * segmentSize
  const end         = (i + 1) * segmentSize

  // Estado inicial
  gsap.set(slide,      { autoAlpha: i === 0 ? 1 : 0 })
  gsap.set(photo,      { y: i === 0 ? '0%' : '100%' })
  gsap.set(bgNombre,   { y: i === 0 ? 0 : 40, autoAlpha: i === 0 ? 1 : 0 })
  gsap.set(bgApellido, { y: i === 0 ? 0 : 40, autoAlpha: i === 0 ? 1 : 0 })
  gsap.set(topInfo,    { y: i === 0 ? 0 : -20, autoAlpha: i === 0 ? 1 : 0 })
  gsap.set(bottomInfo, { y: i === 0 ? 0 : 20,  autoAlpha: i === 0 ? 1 : 0 })

  // Primer slide: entrada sin scroll
  if (i === 0) {
    gsap.timeline({ delay: 0.2 })
      .to(photo,      { y: '0%', duration: 1.4, ease: 'power4.out' }, 0)
      .to(bgNombre,   { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' }, 0.2)
      .to(bgApellido, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' }, 0.3)
      .to(topInfo,    { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' }, 0.5)
      .to(bottomInfo, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' }, 0.65)
  }

  // Scroll trigger para slides > 0
  if (i > 0) {
    ScrollTrigger.create({
      trigger: '#equipoScrollWrap',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p          = self.progress
        const enterEnd   = start + segmentSize * 0.4

        if (p >= start && p < end) {
          const ep = Math.min(1, (p - start) / (enterEnd - start)) // 0→1 durante entrada
          gsap.set(slide,      { autoAlpha: 1 })
          gsap.set(photo,      { y: `${gsap.utils.interpolate(100, 0, easeOut(ep))}%` })
          gsap.set(bgNombre,   { y: gsap.utils.interpolate(40, 0, easeOut(ep)), autoAlpha: gsap.utils.interpolate(0, 1, easeOut(ep)) })
          gsap.set(bgApellido, { y: gsap.utils.interpolate(40, 0, easeOut(ep)), autoAlpha: gsap.utils.interpolate(0, 1, easeOut(ep)) })

          if (ep > 0.45) {
            const tp = (ep - 0.45) / 0.55
            gsap.set(topInfo,    { y: gsap.utils.interpolate(-20, 0, easeOut(tp)), autoAlpha: gsap.utils.interpolate(0, 1, easeOut(tp)) })
            gsap.set(bottomInfo, { y: gsap.utils.interpolate(20,  0, easeOut(tp)), autoAlpha: gsap.utils.interpolate(0, 1, easeOut(tp)) })
          }

          // Salida al pasar al siguiente
          if (i < totalSlides - 1) {
            const exitStart = end - segmentSize * 0.18
            if (p >= exitStart) {
              const xp = (p - exitStart) / (segmentSize * 0.18)
              gsap.set(slide, { autoAlpha: gsap.utils.interpolate(1, 0, easeIn(xp)) })
            }
          }

        } else if (p < start) {
          gsap.set(slide,      { autoAlpha: 0 })
          gsap.set(photo,      { y: '100%' })
          gsap.set(bgNombre,   { y: 40, autoAlpha: 0 })
          gsap.set(bgApellido, { y: 40, autoAlpha: 0 })
          gsap.set(topInfo,    { y: -20, autoAlpha: 0 })
          gsap.set(bottomInfo, { y: 20,  autoAlpha: 0 })
        }
      }
    })
  } else {
    // Slide 0: solo salida
    ScrollTrigger.create({
      trigger: '#equipoScrollWrap',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p         = self.progress
        const exitStart = segmentSize * 0.82
        if (p > exitStart && p < segmentSize) {
          const xp = (p - exitStart) / (segmentSize * 0.18)
          gsap.set(slide, { autoAlpha: gsap.utils.interpolate(1, 0, easeIn(xp)) })
        } else if (p <= exitStart) {
          gsap.set(slide, { autoAlpha: 1 })
        }
      }
    })
  }
})

// Header equipo entrada
gsap.from('.equipo-label', {
  scrollTrigger: { trigger: '.equipo-header', start: 'top 80%' },
  y: 20, autoAlpha: 0, duration: 0.7, ease: 'power3.out'
})
gsap.from('.equipo-titulo', {
  scrollTrigger: { trigger: '.equipo-header', start: 'top 75%' },
  y: 30, autoAlpha: 0, duration: 0.9, ease: 'power3.out', delay: 0.1
})
gsap.from('.equipo-desc', {
  scrollTrigger: { trigger: '.equipo-header', start: 'top 72%' },
  y: 20, autoAlpha: 0, duration: 0.7, ease: 'power3.out', delay: 0.25
})

// ─── SERVICIOS: SCROLL ANIMATIONS ──────────────────────

// Título gigante — parallax vertical suave
gsap.to('#srvTitle', {
  scrollTrigger: {
    trigger: '#servicios',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1.5,
  },
  y: -80,
  ease: 'none',
})

// Header entrada
gsap.from('.srv-label', {
  scrollTrigger: { trigger: '.srv-header', start: 'top 85%' },
  y: 20, autoAlpha: 0, duration: 0.7, ease: 'power3.out'
})
gsap.from('.srv-desc', {
  scrollTrigger: { trigger: '.srv-header', start: 'top 80%' },
  y: 20, autoAlpha: 0, duration: 0.8, ease: 'power3.out', delay: 0.15
})

// Reveal cortinas de las imágenes al scroll
gsap.utils.toArray('.srv-img-curtain').forEach((curtain, i) => {
  gsap.to(curtain, {
    scrollTrigger: {
      trigger: curtain.closest('.srv-img-wrap'),
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    scaleY: 0,
    duration: 1.2,
    ease: 'power4.inOut',
    delay: i * 0.15,
  })
})

// Info de cada servicio — entrada desde abajo
gsap.utils.toArray('.srv-info').forEach((info, i) => {
  gsap.from(info, {
    scrollTrigger: {
      trigger: info,
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
    y: 30, autoAlpha: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: i * 0.1,
  })
})

// ─── CONTACTO: SCROLL ANIMATIONS ───────────────────────

gsap.to('#ctoTitle', {
  scrollTrigger: { trigger: '#contacto', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
  y: -80, ease: 'none',
})

gsap.from('.cto-label', {
  scrollTrigger: { trigger: '.cto-header', start: 'top 85%' },
  y: 20, autoAlpha: 0, duration: 0.7, ease: 'power3.out'
})
gsap.from('.cto-desc', {
  scrollTrigger: { trigger: '.cto-header', start: 'top 80%' },
  y: 20, autoAlpha: 0, duration: 0.8, ease: 'power3.out', delay: 0.15
})

gsap.utils.toArray('.cto-col').forEach((col, i) => {
  gsap.from(col, {
    scrollTrigger: { trigger: '.cto-grid', start: 'top 80%' },
    y: 40, autoAlpha: 0, duration: 0.9, ease: 'power3.out', delay: i * 0.15,
  })
})

gsap.from('.cto-footer', {
  scrollTrigger: { trigger: '.cto-footer', start: 'top 95%' },
  y: 16, autoAlpha: 0, duration: 0.7, ease: 'power3.out'
})

// ─── CHIPS: selección única por grupo ──────────────────
document.querySelectorAll('.rsv-chips').forEach(group => {
  group.querySelectorAll('.rsv-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      group.querySelectorAll('.rsv-chip').forEach(c => c.classList.remove('active'))
      chip.classList.add('active')
    })
  })
})

// ─── WHATSAPP: armar mensaje y abrir ───────────────────
document.getElementById('rsvWaBtn').addEventListener('click', () => {
  const nombre   = document.getElementById('rsv-nombre').value.trim()
  const fecha    = document.getElementById('rsv-fecha').value
  const hora     = document.getElementById('rsv-hora').value
  const notas    = document.getElementById('rsv-notas').value.trim()

  const servicio = document.querySelector('#rsvChips .rsv-chip.active')?.dataset.value || ''
  const barbero  = document.querySelector('#rsvBarbers .rsv-chip.active')?.dataset.value || ''

  // Validación mínima
  if (!nombre) { alert('Por favor ingresa tu nombre.'); return }
  if (!servicio) { alert('Por favor selecciona un servicio.'); return }
  if (!fecha || !hora) { alert('Por favor selecciona fecha y hora.'); return }

  // Formatear fecha legible
  const [y, m, d] = fecha.split('-')
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  const fechaTexto = `${parseInt(d)} de ${meses[parseInt(m)-1]} de ${y}`

  // Armar mensaje
  let msg = `Hola, me gustaría reservar una cita en RÍOS Barber & Groom.\n\n`
  msg += `👤 *Nombre:* ${nombre}\n`
  msg += `✂️ *Servicio:* ${servicio}\n`
  if (barbero) msg += `💈 *Barbero:* ${barbero}\n`
  msg += `📅 *Fecha:* ${fechaTexto}\n`
  msg += `🕐 *Hora:* ${hora} hrs\n`
  if (notas) msg += `📝 *Notas:* ${notas}\n`
  msg += `\n¡Gracias!`

  // Número del dueño — cambia por el real
  const telefono = '525512345678'
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(msg)}`
  window.open(url, '_blank')
})
