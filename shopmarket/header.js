/* ---------------- Mobile burger toggle ---------------- */
const burgerBtn = document.getElementById('burgerBtn');
const mobileNav = document.getElementById('mobileNav');

if (burgerBtn && mobileNav) {
  burgerBtn.addEventListener('click', () => {
    const isHidden = mobileNav.hasAttribute('hidden');
    if (isHidden) {
      mobileNav.removeAttribute('hidden');
      burgerBtn.setAttribute('aria-expanded', 'true');
    } else {
      mobileNav.setAttribute('hidden', '');
      burgerBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---------------- Simple dropdowns (lang/currency/...) ---------------- */
// 1) Отваряне/затваряне на конкретното меню при клик
const ddButtons = document.querySelectorAll('.dropdown-btn[data-dropdown]');
ddButtons.forEach(btn => {
  const id = btn.getAttribute('data-dropdown');
  const menu = document.getElementById(id);
  if (!menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.classList.contains('open');
    // Затваряме всички
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.dropdown-btn[aria-expanded]')
      .forEach(b => b.setAttribute('aria-expanded','false'));
    // Отваряме текущото
    if (!open) {
      menu.classList.add('open');
      btn.setAttribute('aria-expanded','true');
      const rect = btn.getBoundingClientRect();
      menu.style.position = 'absolute';
      menu.style.right = `${document.body.clientWidth - rect.right}px`;
    }
  });
});

// 2) Единствен глобален „outside click“ слушател
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.dropdown-btn[aria-expanded]')
    .forEach(b => b.setAttribute('aria-expanded','false'));
});

// 3) ESC затваря всички dropdown-и
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.dropdown-btn[aria-expanded]')
      .forEach(b => b.setAttribute('aria-expanded','false'));
  }
});

/* ---------------- Categories: desktop = always open sidebar; mobile = off-canvas ---------------- */
const catBtn   = document.querySelector('.cat-btn');     // бутонът в хедъра (ползва се само на мобилно)
const catPanel = document.getElementById('catPanel');
const isDesktop = () => window.matchMedia('(min-width:1024px)').matches;

// overlay само за мобилно off-canvas
let overlay = document.querySelector('.body-overlay');
if (!overlay) {
  overlay = document.createElement('div');
  overlay.className = 'body-overlay';
  document.body.appendChild(overlay);
}

function openCat() {
  // На десктоп сайдбарът е част от layout-а – не го пипаме
  if (isDesktop()) return;
  catPanel.classList.add('open');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeCat() {
  catPanel.classList.remove('open');
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}

// Клик на бутона (само мобилно има ефект)
catBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  if (isDesktop()) return;
  catPanel.classList.contains('open') ? closeCat() : openCat();
});

// Клик извън/overlay → затваряне (само мобилно)
overlay.addEventListener('click', closeCat);
document.addEventListener('click', (e) => {
  if (isDesktop()) return;
  if (!catPanel.contains(e.target) && !catBtn.contains(e.target)) closeCat();
});
document.addEventListener('keydown', (e) => { if (!isDesktop() && e.key === 'Escape') closeCat(); });

// На resize: ако станем десктоп, гарантирано чистим mobile състояние
window.addEventListener('resize', () => {
  if (isDesktop()) {
    closeCat();
  }
});

/* ---------------- Hero slider (autoplay + controls + dots + swipe) ---------------- */
(() => {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  const slides  = Array.from(slider.querySelectorAll('.slide'));
  const dots    = Array.from(slider.querySelectorAll('.dot'));
  const btnPrev = slider.querySelector('.hero-nav.prev');
  const btnNext = slider.querySelector('.hero-nav.next');

  let index = 0;
  const INTERVAL = 5000;
  let timerId;

  function go(to) {
    const old = index;
    index = (to + slides.length) % slides.length;
    slides[old].classList.remove('is-active');
    slides[index].classList.add('is-active');
    if (dots[old]) dots[old].classList.remove('is-active');
    if (dots[index]) dots[index].classList.add('is-active');
  }
  function next(){ go(index + 1); }
  function prev(){ go(index - 1); }
  function play(){ stop(); timerId = setInterval(next, INTERVAL); }
  function stop(){ if (timerId) clearInterval(timerId); }

  btnNext?.addEventListener('click', () => { next(); play(); });
  btnPrev?.addEventListener('click', () => { prev(); play(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { go(i); play(); }));

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', play);
  slider.addEventListener('focusin', stop);
  slider.addEventListener('focusout', play);

  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : play(); });

  let startX = 0, dx = 0;
  slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; dx = 0; stop(); }, {passive:true});
  slider.addEventListener('touchmove',  (e) => { dx = e.touches[0].clientX - startX; }, {passive:true});
  slider.addEventListener('touchend',   () => { if (Math.abs(dx) > 40) (dx < 0 ? next() : prev()); play(); });

  slides[0]?.classList.add('is-active');
  dots[0]?.classList.add('is-active');
  play();
})();



/* ================== Products grid render ================== */
/**
 * Редактираш само този масив – добавяш/махаш продукти.
 * image: път до снимката в проекта (напр. 'assets/pics/iphone-14-pro.jpg')
 * Ако някое поле не ти трябва (напр. oldPriceLv), остави го празно или го махни.
 */
const products = [
  {
    id: 'iphone14pro-128-dp',
    title: 'Apple iPhone 14 Pro',
    variant: 'Deep Purple, 128 GB, Като нов',
    image: 'assets/pics/iphone-14-pro-deeppurple.jpg',
    delivery: '1–2 работни дни',
    interestFree: true,
    oldPriceLv: '1229.99',
    priceLv: '1179.99',
    priceEur: '603.32',
    discount: '- 50 лв',
    stock: 'Ограничена наличност',
    chip: 'Genius оферти -60 лв'
  },
  {
    id: 'airpods-max',
    title: 'AirPods Max',
    variant: 'Space Gray, Отлично състояние',
    image: 'assets/pics/headphones.jpg',
    delivery: 'Експресна доставка',
    interestFree: true,
    oldPriceLv: '',
    priceLv: '1099.00',
    priceEur: '562.00',
    discount: '',
    stock: 'Ограничена наличност',
    chip: 'Hot deal'
  },
  {
    id: 'galaxy-watch6',
    title: 'Samsung Galaxy Watch6',
    variant: '44mm Graphite, Нов',
    image: 'assets/hero-3.jpg',
    delivery: 'До 2 работни дни',
    interestFree: false,
    oldPriceLv: '599.00',
    priceLv: '529.00',
    priceEur: '270.00',
    discount: '- 70 лв',
    stock: '',
    chip: ''
  }
];

// помощни функции за цени с <sup>
function formatPriceSup(numStr){
  const [intPart, decPart=''] = String(numStr || '').split('.');
  if (!intPart) return '';
  const intFmt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;');
  return `${intFmt}${decPart ? `<span class="sup">${decPart}</span>` : ''}`;
}

// SVG-и (кратки), за да не дублираме HTML
const svgTruck = '<svg viewBox="0 0 24 24" class="ico"><path d="M3 7h11v7H3zM14 10h4l3 3v1h-7V10zM6.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="currentColor"/></svg>';
const svgPercent = '<svg viewBox="0 0 24 24" class="ico"><path d="M19 5 5 19M7 7a2 2 0 1 0 0 .01M17 17a2 2 0 1 0 0 .01" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
const svgCart = '<svg viewBox="0 0 24 24" class="ico"><path d="M6 6h15l-1.5 9H8.5L7 4H3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5"/><circle cx="17.5" cy="20" r="1.5"/></svg>';

function productCardHTML(p){
  return `
  <div class="product-card">
    ${p.discount ? `<span class="badge badge-red">${p.discount}</span>` : ''}
    ${p.stock ? `<span class="badge badge-yellow">${p.stock}</span>` : ''}

    <div class="product-media">
      <img src="${p.image}" alt="${p.title}">
      ${p.chip ? `<span class="offer-chip">${p.chip}</span>` : ''}
    </div>

    <div class="product-body">
      <h3 class="title">${p.title}</h3>
      ${p.variant ? `<p class="meta">${p.variant}</p>` : ''}

      <ul class="perks">
        ${p.delivery ? `<li>${svgTruck}${p.delivery}</li>` : ''}
        ${p.interestFree ? `<li>${svgPercent}0% лихва</li>` : ''}
      </ul>

      <div class="price">
        ${p.oldPriceLv ? `<div class="old">${formatPriceSup(p.oldPriceLv)} лв</div>` : ''}
        <div class="now">
          ${formatPriceSup(p.priceLv)} лв
          ${p.priceEur ? `<span class="alt">/ ${formatPriceSup(p.priceEur)} €</span>` : ''}
        </div>
      </div>

      <button class="btn-add">${svgCart}Добави в количката</button>
    </div>
  </div>`;
}

(function renderProducts(){
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = products.map(productCardHTML).join('');
})();
