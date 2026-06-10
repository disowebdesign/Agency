import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { initWork } from './work.js'

gsap.registerPlugin(ScrollTrigger, Flip)

// ─── LENIS ─────────────────────────────────────────────
const lenis = new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
gsap.ticker.add((time) => { lenis.raf(time * 1000) })
gsap.ticker.lagSmoothing(0)
lenis.on('scroll', ScrollTrigger.update)

// ─── LOADER ────────────────────────────────────────────
const loader  = document.getElementById('loader')
const ldrPct  = document.getElementById('ldr-pct')
const ldrBar  = document.getElementById('ldr-bar')

let progress = 0
const pctInterval = setInterval(() => {
  progress += Math.random() * 18
  if (progress >= 100) { progress = 100; clearInterval(pctInterval) }
  if (ldrPct) ldrPct.textContent = Math.floor(progress) + '%'
  if (ldrBar) ldrBar.style.width = progress + '%'
}, 120)

const tl = gsap.timeline()

// Entrada de texto loader
tl.from('.ldr-logo',  { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, 0.2)
  .from('.ldr-inner', { yPercent: 110, duration: 0.8, ease: 'power3.out', stagger: 0.12 }, 0.4)
  .from('.ldr-tag',   { opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.6)
  .to({}, { duration: 1.2 })

// Salida loader
  .to('#loader', {
    yPercent: -100, duration: 0.8, ease: 'power4.inOut',
    onComplete: () => { if (loader) loader.style.display = 'none' }
  })

// Entrada nav
  .from('#nav', { opacity: 0, y: -20, duration: 0.5, ease: 'power2.out' }, '-=0.3')

// Init nav y work
  .call(() => {
    initNav()
    initWork(lenis)
  })

// ─── NAV ───────────────────────────────────────────────
function initNav() {
  const menuBtn   = document.getElementById('nav-menu-btn')
  const overlay   = document.getElementById('menu-overlay')
  const menuLabel = document.getElementById('nav-menu-label')
  const items     = document.querySelectorAll('.menu-item')

  if (!menuBtn || !overlay) return

  let isOpen = false

  gsap.set(overlay, { yPercent: -100, display: 'none' })

  function openMenu() {
    if (isOpen) return
    isOpen = true
    menuBtn.setAttribute('aria-expanded', 'true')
    menuBtn.classList.add('is-active')
    if (menuLabel) menuLabel.textContent = 'CLOSE'
    gsap.set(overlay, { display: 'flex' })
    gsap.set(items, { opacity: 0, y: 24 })
    gsap.set('.menu-footer', { opacity: 0, y: 10 })
    gsap.to(overlay, { yPercent: 0, duration: 0.65, ease: 'power3.inOut' })
    gsap.to(items, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.08, delay: 0.4 })
    gsap.to('.menu-footer', { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.65 })
  }

  function closeMenu() {
    if (!isOpen) return
    isOpen = false
    menuBtn.setAttribute('aria-expanded', 'false')
    menuBtn.classList.remove('is-active')
    if (menuLabel) menuLabel.textContent = 'MENU'
    gsap.to(items, { opacity: 0, y: -10, duration: 0.2, ease: 'power2.in', stagger: { each: 0.04, from: 'end' } })
    gsap.to(overlay, {
      yPercent: -100, duration: 0.6, ease: 'power3.inOut', delay: 0.1,
      onComplete: () => gsap.set(overlay, { display: 'none' })
    })
  }

  menuBtn.addEventListener('click', () => isOpen ? closeMenu() : openMenu())
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeMenu() })

  // Links del menú
  document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href')
      if (href && href.startsWith('#')) {
        e.preventDefault()
        closeMenu()
        setTimeout(() => {
          const target = document.querySelector(href)
          if (target) lenis.scrollTo(target, { offset: 0, duration: 1.4 })
        }, 400)
      } else {
        closeMenu()
      }
    })
  })

  // Botones data-goto
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.getElementById(btn.dataset.goto)
      if (target) {
        if (isOpen) closeMenu()
        setTimeout(() => lenis.scrollTo(target, { offset: 0, duration: 1.4 }), isOpen ? 400 : 0)
      }
    })
  })
}

// ─── GRAIN CANVAS ──────────────────────────────────────
const canvas = document.getElementById('grain-canvas')
if (canvas) {
  const ctx = canvas.getContext('2d')
  let w, h, frame = 0

  function resize() {
    w = canvas.width  = window.innerWidth
    h = canvas.height = window.innerHeight
  }

  function drawGrain() {
    const imgData = ctx.createImageData(w, h)
    const data = imgData.data
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255
      data[i] = data[i+1] = data[i+2] = v
      data[i+3] = 18
    }
    ctx.putImageData(imgData, 0, 0)
    frame++
    if (frame % 2 === 0) requestAnimationFrame(drawGrain)
    else requestAnimationFrame(drawGrain)
  }

  resize()
  window.addEventListener('resize', resize)
  drawGrain()
}

// ─── NOSOTROS ANIMACIONES ──────────────────────────────

// Palabras hero
gsap.utils.toArray('.nos-word').forEach((word, i) => {
  gsap.from(word, {
    scrollTrigger: { trigger: '.nos-hero-headline', start: 'top 80%' },
    opacity: 0, y: 20, duration: 0.6, ease: 'power3.out', delay: i * 0.04
  })
})

// Video reel
ScrollTrigger.create({
  trigger: '#nosReelWrap',
  start: 'top 85%',
  onEnter: () => {
    gsap.to('#nosReelWrap', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
    gsap.to('#nosHeroPara', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.15 })
  }
})
gsap.set('#nosReelWrap', { opacity: 0, y: 40 })
gsap.set('#nosHeroPara', { opacity: 0, y: 30 })

// Play button reel
const playBtn = document.getElementById('nosReelPlay')
const reelOverlay = document.getElementById('nosReelOverlay')
const reelVideo = document.getElementById('nosReelVideo')
if (playBtn && reelOverlay && reelVideo) {
  playBtn.addEventListener('click', () => {
    gsap.to(reelOverlay, { opacity: 0, duration: 0.4, onComplete: () => {
      reelOverlay.style.display = 'none'
      reelVideo.src = reelVideo.src.replace('autoplay=0', 'autoplay=1')
    }})
  })
}

// Carretes diagonales
gsap.from('.nos-reel-row--1', {
  scrollTrigger: { trigger: '#nosShaping', start: 'top 80%' },
  x: -150, opacity: 0, duration: 1.2, ease: 'power3.out'
})
gsap.from('.nos-reel-row--2', {
  scrollTrigger: { trigger: '#nosShaping', start: 'top 75%' },
  x: 150, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.15
})

// Texto shaping
gsap.utils.toArray('.nos-sw').forEach((word, i) => {
  gsap.from(word, {
    scrollTrigger: { trigger: '#nosShaping', start: 'top 75%' },
    opacity: 0, y: 30, duration: 0.7, ease: 'power3.out', delay: i * 0.08
  })
})

// About lines
gsap.utils.toArray('.nos-ab-inner').forEach((line, i) => {
  gsap.from(line, {
    scrollTrigger: { trigger: '.nos-about-header', start: 'top 80%' },
    yPercent: 110, duration: 0.8, ease: 'power3.out', delay: i * 0.1
  })
})

// About imagen
gsap.from('.nos-about-img-inner', {
  scrollTrigger: { trigger: '.nos-about-body', start: 'top 80%' },
  scale: 1.1, opacity: 0, duration: 1.1, ease: 'power3.out'
})

gsap.from('.nos-about-content', {
  scrollTrigger: { trigger: '.nos-about-body', start: 'top 75%' },
  x: 40, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.2
})

// Skills hover
const skillItems = document.querySelectorAll('.nos-skills-item')
const skillImgs  = document.querySelectorAll('.nos-skills-img')
skillItems.forEach((item, i) => {
  item.addEventListener('mouseenter', () => {
    skillImgs.forEach(img => img.classList.remove('active'))
    if (skillImgs[i]) skillImgs[i].classList.add('active')
    gsap.from(skillImgs[i], { opacity: 0, scale: 1.05, duration: 0.5, ease: 'power2.out' })
  })
})

// ─── CONTACTO ──────────────────────────────────────────
const chips = document.querySelectorAll('.ctc-chip')
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'))
    chip.classList.add('active')
  })
})

const submitBtn = document.getElementById('ctc-submit')
const successEl = document.getElementById('ctc-success')
if (submitBtn) {
  submitBtn.addEventListener('click', () => {
    const name    = document.getElementById('ctc-name')?.value.trim()
    const email   = document.getElementById('ctc-email')?.value.trim()
    const msg     = document.getElementById('ctc-msg')?.value.trim()
    const interes = document.querySelector('.ctc-chip.active')?.dataset.val || ''

    if (!name || !email || !msg) { alert('Por favor completa todos los campos.'); return }

    let waMsg = `Hola DISO®, me interesa: *${interes}*\n\n`
    waMsg += `👤 *Nombre:* ${name}\n`
    waMsg += `📧 *Email:* ${email}\n`
    waMsg += `💬 *Mensaje:* ${msg}`

    window.open(`https://wa.me/525525051055?text=${encodeURIComponent(waMsg)}`, '_blank')

    if (successEl) {
      gsap.to(successEl, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
      successEl.style.display = 'flex'
    }
  })
}
