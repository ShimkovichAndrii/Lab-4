const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* адаптивне меню */
const burger = $('.burger'), menu = $('#menu');
const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.innerHTML = open ? '&times;' : '&#9776;';
};
burger.onclick = () => setMenu(!menu.classList.contains('open'));
$$('#menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));

/* модальне вікно входу */
const dlg = $('#signin');
$$('[data-open]').forEach(b => b.onclick = () => dlg.showModal());
$$('[data-close]').forEach(b => b.addEventListener('click', () => dlg.close()));
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

/* кнопка «вгору» з'являється після прокручування */
const up = $('.to-top');
const toggleUp = () => up.classList.toggle('visible', scrollY > 400);
addEventListener('scroll', toggleUp, { passive: true });
toggleUp();

/* карусель відгуків */
const car = $('.carousel'), track = $('.carousel-track'), slides = $$('.slide'), dotsBox = $('.dots');
let cur = 0, timer;
slides.forEach((_, n) => {
    const d = document.createElement('button');
    d.type = 'button'; d.className = 'dot'; d.setAttribute('aria-label', 'Відгук ' + (n + 1));
    d.onclick = () => go(n);
    dotsBox.append(d);
});
function go(n) {
    cur = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${cur * 100}%)`;
    $$('.dot').forEach((d, k) => d.classList.toggle('active', k === cur));
}
const play = () => { timer = setInterval(() => go(cur + 1), 6000); };
$('.prev').onclick = () => go(cur - 1);
$('.next').onclick = () => go(cur + 1);
car.onmouseenter = () => clearInterval(timer);
car.onmouseleave = play;
let x0;
car.ontouchstart = e => x0 = e.touches[0].clientX;
car.ontouchend = e => { const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 50) go(cur + (d < 0 ? 1 : -1)); };
go(0);
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) play();

/* поява елементів при прокручуванні */
const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.15 });
$$('.tour-card, .news-item, .news-visual, #widp address p, .carousel').forEach(el => { el.classList.add('reveal'); io.observe(el); });
