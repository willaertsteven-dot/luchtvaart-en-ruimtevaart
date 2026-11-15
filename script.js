// Sterrenhemel
const canvas = document.getElementById('sterren');
const ctx = canvas.getContext('2d');
let sterren = [];
function maakSterren() {
  canvas.width = innerWidth; canvas.height = innerHeight;
  sterren = Array.from({ length: Math.floor(innerWidth * innerHeight / 6000) }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: Math.random() * 1.4 + .2, f: Math.random() * Math.PI * 2
  }));
}
function teken(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of sterren) {
    ctx.globalAlpha = .4 + .6 * Math.abs(Math.sin(t / 1500 + s.f));
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
  }
  requestAnimationFrame(teken);
}
addEventListener('resize', maakSterren); maakSterren(); requestAnimationFrame(teken);

// Mobiel menu
const menuKnop = document.querySelector('.menu-knop');
const nav = document.querySelector('.nav nav');
menuKnop.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuKnop.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// SpaceX-tabs
document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('actief'));
  document.querySelectorAll('.paneel').forEach(p => p.classList.remove('actief'));
  tab.classList.add('actief');
  document.getElementById('tab-' + tab.dataset.tab).classList.add('actief');
}));

// Tijdlijn verschijnt bij scrollen
const obs = new IntersectionObserver(items => items.forEach(i => {
  if (i.isIntersecting) { i.target.classList.add('zichtbaar'); obs.unobserve(i.target); }
}), { threshold: .2 });
document.querySelectorAll('.tijdlijn li').forEach(li => obs.observe(li));

// Lancering
const klok = document.getElementById('aftelklok');
const status = document.getElementById('lanceerStatus');
const raket = document.getElementById('miniRaket');
const startKnop = document.getElementById('startKnop');
const resetKnop = document.getElementById('resetKnop');
const meldingen = { 10: 'Alle systemen nominaal', 7: 'Tanken voltooid', 5: 'Strongback trekt terug', 3: 'Motoren ontsteken…', 1: 'Klaar…' };
let timer;
startKnop.addEventListener('click', () => {
  startKnop.disabled = true;
  let t = 10;
  klok.textContent = 'T-' + t; status.textContent = meldingen[10];
  timer = setInterval(() => {
    t--;
    if (t > 0) {
      klok.textContent = 'T-' + t;
      if (meldingen[t]) status.textContent = meldingen[t];
      if (t <= 3) raket.classList.add('trilt');
    } else {
      clearInterval(timer);
      klok.textContent = 'LIFTOFF!';
      status.textContent = 'De raket heeft de toren verlaten 🚀';
      raket.classList.remove('trilt'); raket.classList.add('weg');
      resetKnop.disabled = false;
    }
  }, 1000);
});
resetKnop.addEventListener('click', () => {
  clearInterval(timer);
  raket.classList.remove('weg', 'trilt');
  klok.textContent = 'T-10'; status.textContent = 'Klaar voor lancering';
  startKnop.disabled = false; resetKnop.disabled = true;
});

// Quiz
const vragen = [
  { v: 'In welk jaar maakten de gebroeders Wright hun eerste gemotoriseerde vlucht?', a: ['1899', '1903', '1911', '1927'], g: 1 },
  { v: 'Hoeveel Merlin-motoren zitten er in de eerste trap van een Falcon 9?', a: ['3', '5', '9', '27'], g: 2 },
  { v: 'Wie was de eerste mens in de ruimte?', a: ['Neil Armstrong', 'Joeri Gagarin', 'John Glenn', 'Valentina Teresjkova'], g: 1 },
  { v: 'Welke bijnaam heeft de Boeing 747?', a: ['Queen of the Skies', 'Jumbo Falcon', 'Sky King', 'Blackbird'], g: 0 },
  { v: 'Wat had Falcon Heavy bij zijn eerste vlucht in 2018 aan boord als testlading?', a: ['Een satelliet van ESA', 'Een Tesla Roadster', 'Een Dragon-capsule', 'Niets'], g: 1 },
  { v: 'Wie was de eerste Belg in de ruimte?', a: ['Frank De Winne', 'Dirk Frimout', 'Raphaël Liégeois', 'Eddy Merckx'], g: 1 },
  { v: 'Hoeveel Raptor-motoren heeft de Super Heavy-booster van Starship?', a: ['9', '27', '33', '42'], g: 2 },
  { v: 'In welk jaar landden mensen voor het eerst op de Maan?', a: ['1965', '1969', '1972', '1975'], g: 1 }
];
let huidig = 0, score = 0;
const vraagEl = document.getElementById('vraag'), antwEl = document.getElementById('antwoorden');
const fbEl = document.getElementById('feedback'), volgEl = document.getElementById('volgende');
const nrEl = document.getElementById('vraagNr'), balk = document.getElementById('quizBalk');
function toonVraag() {
  const q = vragen[huidig];
  nrEl.textContent = `Vraag ${huidig + 1} van ${vragen.length}`;
  balk.style.width = (huidig / vragen.length * 100) + '%';
  vraagEl.textContent = q.v; fbEl.textContent = ''; volgEl.hidden = true; antwEl.innerHTML = '';
  q.a.forEach((tekst, i) => {
    const b = document.createElement('button');
    b.className = 'antwoord'; b.textContent = tekst;
    b.addEventListener('click', () => kies(i));
    antwEl.appendChild(b);
  });
}
function kies(i) {
  const q = vragen[huidig], knoppen = antwEl.querySelectorAll('button');
  knoppen.forEach(b => b.disabled = true);
  knoppen[q.g].classList.add('goed');
  if (i === q.g) { score++; fbEl.textContent = '✅ Juist!'; }
  else { knoppen[i].classList.add('fout'); fbEl.textContent = '❌ Helaas, het juiste antwoord is: ' + q.a[q.g]; }
  volgEl.textContent = huidig < vragen.length - 1 ? 'Volgende vraag' : 'Bekijk je score';
  volgEl.hidden = false;
}
volgEl.addEventListener('click', () => {
  huidig++;
  if (huidig < vragen.length) return toonVraag();
  balk.style.width = '100%';
  nrEl.textContent = 'Klaar!';
  const oordeel = score === vragen.length ? 'Perfect! Jij bent klaar voor Mars 🚀' : score >= 5 ? 'Knap gedaan, piloot! ✈️' : 'Blijf oefenen, cadet! 🛰️';
  vraagEl.textContent = `Je score: ${score} / ${vragen.length}`;
  antwEl.innerHTML = ''; fbEl.textContent = oordeel;
  volgEl.textContent = 'Opnieuw spelen';
  volgEl.onclick = () => { huidig = 0; score = 0; volgEl.onclick = null; toonVraag(); };
});
toonVraag();
