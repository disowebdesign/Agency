/**
 * work.js — exporta initWork(lenis)
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

export function initWork(lenis) {

  lenis.on('scroll', ScrollTrigger.update)

  /* ── IFRAME SCALE ──────────────────────────── */
  function setIframeScales() {
    document.querySelectorAll('.wg-phone-frame').forEach(frame => {
      const frameW = frame.offsetWidth
      if (frameW === 0) return
      const scale = frameW / 390
      const iframe = frame.querySelector('iframe')
      if (iframe) {
        iframe.style.transform = `scale(${scale})`
        iframe.style.height    = `${frame.offsetHeight / scale}px`
      }
    })
  }

  requestAnimationFrame(() => requestAnimationFrame(setIframeScales))
  window.addEventListener('load', setIframeScales)
  window.addEventListener('resize', setIframeScales)
  document.querySelectorAll('.wg-phone-frame iframe').forEach(iframe => {
    iframe.addEventListener('load', setIframeScales)
  })

  /* ── FILTROS ───────────────────────────────── */
  const filterBtns  = document.querySelectorAll('.wg-filter')
  const wg          = document.getElementById('wg')
  const flatGrid    = document.getElementById('wg-flat')
  let currentFilter = 'all'

  function getCards() { return [...document.querySelectorAll('.wg-card')] }

  function applyFilter(filter) {
    if (filter === currentFilter) return
    currentFilter = filter
    const cards = getCards()

    if (filter === 'all') {
      const state = Flip.getState(cards, { props: 'opacity' })
      cards.forEach(card => {
        const col = document.querySelector(`.wg-col[data-col="${card.dataset.col}"]`)
        if (col) col.appendChild(card)
        gsap.set(card, { opacity: 1, scale: 1, display: '' })
      })
      wg.classList.remove('wg--filtered')
      Flip.from(state, { duration: .65, ease: 'power3.out', stagger: { amount: .3 } })
      setTimeout(setIframeScales, 800)
    } else {
      const matching    = cards.filter(c => c.dataset.cat === filter)
      const notMatching = cards.filter(c => c.dataset.cat !== filter)

      gsap.to(notMatching, {
        opacity: 0, scale: .93, duration: .2, ease: 'power2.in',
        onComplete: () => {
          notMatching.forEach(c => gsap.set(c, { display: 'none' }))
          const state = Flip.getState(matching, { props: 'opacity,scale' })
          matching.forEach(card => {
            flatGrid.appendChild(card)
            gsap.set(card, { opacity: 1, scale: 1, display: '' })
          })
          wg.classList.add('wg--filtered')
          Flip.from(state, {
            duration: .65, ease: 'power3.out', stagger: { amount: .3 },
            onEnter: els => gsap.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .4 })
          })
          gsap.to(matching, { opacity: 1, scale: 1, duration: .4 })
          setTimeout(setIframeScales, 800)
        }
      })
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      applyFilter(btn.dataset.filter)
    })
  })

  /* ── PARALLAX ──────────────────────────────── */
  document.querySelectorAll('.wg-col').forEach(col => {
    const speed = parseFloat(col.dataset.speed) || 0
    if (speed === 0) return
    gsap.to(col, {
      yPercent: -(speed * 20),
      ease: 'none',
      scrollTrigger: { trigger: '.wg', start: 'top bottom', end: 'bottom top', scrub: 1.5 }
    })
  })

  /* ── REVEAL CARDS ──────────────────────────── */
  gsap.from('.wg-card', {
    opacity: 0, y: 50, duration: .9, stagger: .07, ease: 'power2.out',
    scrollTrigger: { trigger: '.wg', start: 'top 85%' }
  })

  /* ── CLICK EN CARD ─────────────────────────── */
  getCards().forEach(card => {
    if (card.dataset.href) {
      card.addEventListener('click', () => window.open(card.dataset.href, '_blank'))
    }
  })
}
