/* ==============================================================
   SARAPHTHA — SCROLL MAGIC
   As you scroll, "progress" goes from 0 (top) to 1 (bottom).
   Everything in the scene is driven by that one number.
   ============================================================== */

// ---------- 1. Grab the pieces of the scene ----------
const scene = document.getElementById('scene');
const svg = document.getElementById('scene-svg');
const stars = document.getElementById('stars');
const starsTwinkle = document.getElementById('stars-twinkle');
const shootingStars = document.getElementById('shooting-stars');
const space = document.getElementById('space');
const moon = document.getElementById('moon');
const sun = document.getElementById('sun');
const birds = document.getElementById('birds');
const hills = document.getElementById('hills');
const windows = document.querySelectorAll('.window');
const kite = document.getElementById('kite');
const kiteString = document.getElementById('kite-string');
const cloudsLayer = document.getElementById('clouds');
const clouds = document.querySelectorAll('.cloud');
const navLinks = document.querySelectorAll('.nav__links a');

// ---------- 2. Little helper functions ----------

// Smoothly goes from 0 to 1 as x moves from a to b (eases in and out)
function ease(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// Blends two hex colours. t = 0 gives colourA, t = 1 gives colourB
function mixColours(colourA, colourB, t) {
  const a = parseInt(colourA.slice(1), 16);
  const b = parseInt(colourB.slice(1), 16);
  const channels = [16, 8, 0].map((shift) => {
    const from = (a >> shift) & 255;
    const to = (b >> shift) & 255;
    return Math.round(from + (to - from) * t).toString(16).padStart(2, '0');
  });
  return '#' + channels.join('');
}

// ---------- 3. Sky colours: [progress, top colour, bottom colour] ----------
// Want a different mood? Change these colours.
const SKY = [
  [0.00, '#8E7DBA', '#FCE3B4'], // sunset
  [0.25, '#4B3F7A', '#E79A8C'], // dusk
  [0.50, '#1E1E4A', '#4A3A78'], // night
  [0.75, '#0D0F2B', '#1C1B45'], // deep night
  [1.00, '#05060F', '#110E2A'], // outer space
];

function skyAt(progress) {
  let i = 0;
  while (i < SKY.length - 2 && progress > SKY[i + 1][0]) i++;
  const [startAt, startTop, startBottom] = SKY[i];
  const [endAt, endTop, endBottom] = SKY[i + 1];
  const t = Math.min(1, Math.max(0, (progress - startAt) / (endAt - startAt)));
  return [mixColours(startTop, endTop, t), mixColours(startBottom, endBottom, t)];
}

// Kite flight path on big screens: [progress, position]
// Cards sit left (Work), right (About), left (Process), centre (Contact),
// so the kite swoops to the opposite side each time.
const KITE_X = [[0, 900], [0.25, 1080], [0.5, 470], [0.75, 1080], [1, 1120]];
const KITE_Y = [[0, 210], [0.25, 240], [0.5, 180], [0.75, 230], [1, 160]];

// Glides smoothly between the points in a path like KITE_X
function followPath(path, progress) {
  let i = 0;
  while (i < path.length - 2 && progress > path[i + 1][0]) i++;
  const [startAt, startValue] = path[i];
  const [endAt, endValue] = path[i + 1];
  return startValue + (endValue - startValue) * ease(startAt, endAt, progress);
}

// ---------- 4. Draw the stars (same pattern every visit) ----------
function makeStars(count, seed) {
  // A tiny random number generator with a fixed seed
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const dots = [];
  for (let i = 0; i < count; i++) {
    const x = (random() * 100).toFixed(2);
    const y = (random() * 100).toFixed(2);
    const size = 1 + random() * 1.6;
    const alpha = (0.55 + random() * 0.45).toFixed(2);
    dots.push(
      `radial-gradient(circle ${size.toFixed(1)}px at ${x}% ${y}%, ` +
      `rgba(255,255,255,${alpha}) 0, rgba(255,255,255,${alpha}) ${(size / 2).toFixed(1)}px, ` +
      `rgba(255,255,255,0) ${size.toFixed(1)}px)`
    );
  }
  return dots.join(', ');
}
stars.style.backgroundImage = makeStars(70, 7);
starsTwinkle.style.backgroundImage = makeStars(40, 23);

// ---------- 5. Fit the scene to the screen shape ----------
// On wide screens the drawing is centred. On tall phone screens we
// shift the view so the girl stays visible, and move the kite, sun,
// moon and galaxy into the part of the sky you can actually see.
let layout = { narrow: false, left: 0, width: 1440 };

function updateLayout() {
  const narrow = window.innerWidth / window.innerHeight < 1.1;
  if (narrow) {
    const viewLeft = 300;
    const scale = Math.max(window.innerWidth / 1440, window.innerHeight / 900);
    svg.setAttribute('viewBox', `${viewLeft} 0 1440 900`);
    svg.setAttribute('preserveAspectRatio', 'xMinYMax slice');
    layout = { narrow: true, left: viewLeft, width: window.innerWidth / scale };
  } else {
    svg.setAttribute('viewBox', '0 0 1440 900');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    layout = { narrow: false, left: 0, width: 1440 };
  }
}

// ---------- 6. The main update — runs every time you scroll ----------
function update() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;

  // Sky colour
  const [top, bottom] = skyAt(progress);
  scene.style.background = `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)`;

  // Where things sit horizontally (only changes on phones)
  const { narrow, left, width } = layout;
  const sunShift = narrow ? left + width * 0.78 - 1250 : 0;
  const moonShift = narrow ? left + width * 0.75 - 1200 : 0;
  const galaxyShift = narrow ? left + width * 0.6 - 1040 : 0;

  // Sun sets and fades (on phones it starts lower so it doesn't cover your intro)
  const sunStart = narrow ? 110 : 0;
  sun.setAttribute('transform', `translate(${sunShift} ${sunStart + ease(0, 0.3, progress) * 350})`);
  sun.style.opacity = 1 - ease(0.15, 0.35, progress);

  // Birds only around sunset
  birds.style.opacity = 1 - ease(0.2, 0.35, progress);

  // Hills, house and girl drop away (we're rising with the kite)
  const hillDrop = ease(0, 0.5, progress) * 820;
  hills.setAttribute('transform', `translate(0 ${hillDrop})`);

  // House lights switch on at dusk
  const windowColour = progress > 0.1 ? '#FFD27A' : '#FCE3B4';
  windows.forEach((w) => w.setAttribute('fill', windowColour));

  // Stars, shooting stars, moon
  const starOpacity = ease(0.25, 0.5, progress);
  stars.style.opacity = starOpacity;
  starsTwinkle.style.opacity = starOpacity;
  shootingStars.style.opacity = ease(0.45, 0.6, progress);
  moon.setAttribute('transform', `translate(${moonShift} 0)`);
  moon.style.opacity = ease(0.3, 0.45, progress) * (1 - ease(0.7, 0.85, progress));

  // Galaxy and planets drift down into view at the end
  const spaceDrop = (1 - ease(0.6, 1, progress)) * -420;
  space.setAttribute('transform', `translate(${galaxyShift} ${spaceDrop})`);
  space.style.opacity = ease(0.65, 0.9, progress);

  // Clouds fade and drift down
  cloudsLayer.style.setProperty('--cloud-opacity', 1 - ease(0.1, 0.3, progress));
  cloudsLayer.style.setProperty('--cloud-drift', `${progress * 260}px`);
  cloudsLayer.classList.toggle('is-hidden', progress > 0.27);

  // The kite wanders across the sky, always connected to the girl's hand.
  // On big screens it flies to whichever side the content card ISN'T on.
  let kiteX;
  let kiteY;
  if (narrow) {
    kiteX = left + width * 0.72 - width * 0.22 * Math.sin(progress * Math.PI) + 20 * Math.sin(progress * 10);
    kiteY = 210 + 40 * Math.sin(progress * 7);
  } else {
    kiteX = followPath(KITE_X, progress) + 30 * Math.sin(progress * 10);
    kiteY = followPath(KITE_Y, progress) + 15 * Math.sin(progress * 13);
  }
  const moveX = kiteX - 900;
  const moveY = kiteY - 210;
  kite.setAttribute('transform', `translate(${moveX} ${moveY})`);

  // Kite string: from her hand (which moves with the hills) to the kite
  const handX = 446;
  const handY = 630 + hillDrop;
  const endX = 883 + moveX;
  const endY = 288 + moveY;
  const bendX = (handX + endX) / 2 + 90;
  const bendY = (handY + endY) / 2 + 110;
  kiteString.setAttribute('d', `M${handX} ${handY} Q ${bendX} ${bendY} ${endX} ${endY}`);
  // Dashed once she's far below — a hint that the string is very long
  kiteString.setAttribute('stroke-dasharray', progress > 0.5 ? '6 6' : 'none');
}

// Only redraw once per screen refresh, however fast you scroll
let ticking = false;
function requestUpdate() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    update();
    ticking = false;
  });
}

window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', () => {
  updateLayout();
  requestUpdate();
});
updateLayout();
update();

// ---------- 7. Clouds puff away when clicked, then float back ----------
clouds.forEach((cloud) => {
  cloud.addEventListener('click', () => {
    cloud.classList.add('is-puffed');
    setTimeout(() => cloud.classList.remove('is-puffed'), 3500);
  });
});

// ---------- 8. Underline the menu item for the section on screen ----------
const sections = document.querySelectorAll('main section[id]');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
        if (isCurrent) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  },
  // A section counts as "on screen" when it crosses the middle of the window
  { rootMargin: '-50% 0px -50% 0px' }
);
sections.forEach((section) => observer.observe(section));

// ---------- 9. NEW: Captions for the Work cards ----------
// Copies each card image's alt text into a caption that shows on hover.
document.querySelectorAll('.work-card img').forEach((img) => {
  if (!img.alt) return;
  const caption = document.createElement('span');
  caption.className = 'work-card__caption';
  caption.textContent = img.alt;
  caption.setAttribute('aria-hidden', 'true'); // screen readers already read the alt text
  img.after(caption);
});
