/**
 * nav.js — DISO Agency
 * Exporta: initNav()
 */
import { gsap } from 'gsap'

export function initNav() {
  const menuBtn  = document.getElementById('nav-menu-btn')
  const overlay  = document.getElementById('menu-overlay')
  const menuLabel = document.getElementById('nav-menu-label')
  const links    = document.querySelectorAll('.menu-link')

  if (!menuBtn || !overlay) return

  let isOpen = false

  function openMenu() {
    if (isOpen) return
    isOpen = true
    menuBtn.setAttribute('aria-expanded', 'true')
    menuBtn.classList.add('is-active')
    if (menuLabel) menuLabel.textContent = 'CLOSE'
    overlay.classList.add('is-open')
    gsap.set(overlay, { display: 'flex', yPercent: -100 })
    gsap.set('.menu-item', { opacity: 0, y: 24 })
    gsap.to(overlay, { yPercent: 0, duration: 0.65, ease: 'power3.inOut' })
    gsap.to('.menu-item', { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.08, delay: 0.45 })
    gsap.to('.menu-footer', { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.7 })
  }

  function closeMenu() {
    if (!isOpen) return
    isOpen = false
    menuBtn.setAttribute('aria-expanded', 'false')
    menuBtn.classList.remove('is-active')
    if (menuLabel) menuLabel.textContent = 'MENU'
    gsap.to('.menu-item', { opacity: 0, y: -10, duration: 0.2, ease: 'power2.in', stagger: { each: 0.04, from: 'end' } })
    gsap.to(overlay, {
      yPercent: -100, duration: 0.6, ease: 'power3.inOut', delay: 0.1,
      onComplete: () => {
        overlay.classList.remove('is-open')
        gsap.set(overlay, { display: 'none' })
      }
    })
  }

  // Init state
  gsap.set(overlay, { display: 'none' })
  gsap.set('.menu-footer', { opacity: 0, y: 10 })

  menuBtn.addEventListener('click', () => isOpen ? closeMenu() : openMenu())

  // Cerrar al hacer click en links
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const goto = link.getAttribute('href')
      closeMenu()
      if (goto && goto.startsWith('#')) {
        e.preventDefault()
        setTimeout(() => {
          const target = document.querySelector(goto)
          if (target) target.scrollIntoView({ behavior: 'smooth' })
        }, 400)
      }
    })
  })

  // data-goto buttons (LET'S TALK etc)
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.getElementById(btn.dataset.goto)
      if (target) {
        closeMenu()
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), isOpen ? 400 : 0)
      }
    })
  })

  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeMenu() })
}
