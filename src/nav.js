/**
 * nav.js — Menú cortina estilo DON Barber
 * Exporta: initNav()
 */
import { gsap } from 'gsap'

export function initNav() {
  const menuBtn = document.querySelector('.nav-menu')
  const overlay = document.getElementById('nav-overlay')
  const closeBtn = document.getElementById('nvoClose')
  const links   = overlay ? overlay.querySelectorAll('.nvo-link') : []

  if (!menuBtn || !overlay) return

  let isOpen = false

  function openMenu() {
    if (isOpen) return
    isOpen = true
    menuBtn.classList.add('is-active')
    overlay.classList.add('is-open')
    gsap.set(overlay, { yPercent: -100 })
    gsap.set(links, { opacity: 0, y: 20 })
    gsap.to(overlay, { yPercent: 0, duration: 0.7, ease: 'power3.inOut' })
    gsap.to(links, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.08, delay: 0.5 })
  }

  function closeMenu() {
    if (!isOpen) return
    isOpen = false
    menuBtn.classList.remove('is-active')
    gsap.to(links, { opacity: 0, y: -10, duration: 0.2, ease: 'power2.in', stagger: { each: 0.04, from: 'end' } })
    gsap.to(overlay, { yPercent: -100, duration: 0.6, ease: 'power3.inOut', delay: 0.1,
      onComplete: () => overlay.classList.remove('is-open') })
  }

  menuBtn.addEventListener('click', () => isOpen ? closeMenu() : openMenu())
  closeBtn.addEventListener('click', closeMenu)
  links.forEach(link => link.addEventListener('click', closeMenu))
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeMenu() })
}
