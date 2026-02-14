// ---------- helpers ----------
const $ = (id) => document.getElementById(id);
const scrollToId = (id) => $(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
const unlock = (id) => { const el = $(id); if (!el) return; el.classList.remove("locked"); el.classList.add("unlocked"); };

const lines = {
  r1: "Some beginnings are quiet… and then they become everything.",
  r2: "Even from miles away… you still make my heart flutter.",
  r3: "Distance can stretch the days… but it can’t shrink what I feel for you.",
  r4: "Real love doesn’t run away… it returns, it learns, and it stays.",
  r5: "You make even a normal day feel like something I want to remember.",
  r6: "Thinking about our future with you in it… feels like the sweetest kind of hope.",
  r7: "Whatever you choose… my answer is still you."
};

function setReaction(id, text){
  const el = $(id);
  if (!el) return;
  el.textContent = "One second… ❤️";
  setTimeout(() => el.textContent = text, 650);
}

// ---------- lock everything except s0 ----------
["s1","s2","s3","s4","s5","s6","s7","s8","final"].forEach(id => $(id)?.classList.add("locked"));

// ---------- clicking to unlock & scroll ----------
function goNext(nextId){
  unlock(nextId);

  // wait 5 seconds so he can read + enjoy the animation
  setTimeout(() => {
    scrollToId(nextId);
  }, 2000);
}


document.querySelectorAll(".nextBtn").forEach(btn => {
  btn.addEventListener("click", () => goNext(btn.dataset.next));
});

document.querySelectorAll(".choiceBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    // optional FX trigger
    const fx = btn.dataset.fx;
    console.log("clicked:", btn.textContent, "fx:", btn.dataset.fx);

    if (fx) startFx(fx);

    // optional animation trigger
    const anim = btn.dataset.anim;
    if (anim === "split") triggerSplit();
    if (anim === "bond") triggerBond();

    // set reaction (based on which section we're in)
    const currentSection = btn.closest(".section")?.id;
    if (currentSection === "s1") setReaction("r1", lines.r1);
    if (currentSection === "s2") setReaction("r2", lines.r2);
    if (currentSection === "s3") setReaction("r3", lines.r3);
    if (currentSection === "s4") setReaction("r4", lines.r4);
    if (currentSection === "s5") setReaction("r5", lines.r5);
    if (currentSection === "s6") setReaction("r6", lines.r6);

    goNext(btn.dataset.next);
  });
});

// ---------- mood section logic ----------
const whyAll = $("whyAll");
const toPause = $("toPause");

document.querySelectorAll(".moodBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    // show reveal
    whyAll.hidden = false;
    toPause.hidden = false;

    setReaction("r7", "But why settle for one… when I’m ready to give you all… ❤️");

    setTimeout(() => whyAll.scrollIntoView({behavior:"smooth", block:"center"}), 200);
  });
});

toPause?.addEventListener("click", () => goNext("s8"));

// ---------- split animation ----------
function triggerSplit(){
  $("split")?.classList.add("on");
}

// ---------- bond (fights) animation ----------
function triggerBond(){
  const b = $("bond");
  if (!b) return;
  b.classList.remove("heal");
  b.classList.add("sep");
  setTimeout(() => {
    b.classList.add("heal");
  }, 900);
}

// ---------- music ----------
const music = $("bgMusic");
const musicBtn = $("musicBtn");
let musicOn = false;

musicBtn.addEventListener("click", async () => {
  try{
    if (!musicOn){
      await music.play();
      musicOn = true;
      musicBtn.textContent = "⏸ Pause music";
    } else {
      music.pause();
      musicOn = false;
      musicBtn.textContent = "▶ Play music";
    }
  } catch (e){
    alert("Music couldn’t play. Please check assets/music/song.mp3");
  }
});

// ---------- floating hearts background ----------
const bg = $("bg-hearts");
const rand = (a,b)=>Math.random()*(b-a)+a;

function spawnBgHeart(){
  const h = document.createElement("div");
  h.className = "bgHeart";
  const size = rand(10, 26);
  h.style.width = `${size}px`;
  h.style.height = `${size}px`;
  h.style.left = `${rand(0,100)}vw`;
  h.style.background = ["rgba(255,90,150,.55)","rgba(255,160,200,.45)","rgba(210,30,70,.25)","rgba(255,120,170,.45)"][Math.floor(rand(0,4))];
  const dur = rand(10, 18);
  h.style.animationDuration = `${dur}s`;
  bg.appendChild(h);
  setTimeout(()=>h.remove(), dur*1000);
}
setInterval(spawnBgHeart, 650);
for (let i=0;i<10;i++) setTimeout(spawnBgHeart, i*220);

// ---------- FX layers ----------
const fxButterflies = $("fx-butterflies");
const fxFlowers = $("fx-flowers");
const fxFuture = $("fx-future");
const fxBundle = document.getElementById("fx-bundle");


let timers = { butterflies:null, flowers:null, future:null, bundle:null };


function clearFx(name){
  const map = {
    butterflies: fxButterflies,
    flowers: fxFlowers,
    future: fxFuture,
    bundle: fxBundle
  };

  const el = map[name];
  if (!el) return;

  if (timers[name]) {
    clearInterval(timers[name]);
    timers[name] = null;
  }

  el.querySelectorAll(".fxItem").forEach(n => n.remove());
  el.classList.remove("on");
}


function startFx(name){
  // ADD THIS LINE HERE
  ["butterflies","flowers","future","bundle"].forEach(n => {
    if (n !== name) clearFx(n);
  }); 
  if (name === "butterflies"){
  clearFx("butterflies");
  fxButterflies.classList.add("on");

  // SUDDEN burst (like you asked)
  for (let i = 0; i < 22; i++) {
    setTimeout(spawnButterfly, i * 40); // burst spread over ~1 sec
  }

  // Keep a few more coming (gentle continuation)
  timers.butterflies = setInterval(spawnButterfly, 180);

  // Stop after 6 seconds
  setTimeout(() => clearFx("butterflies"), 6000);

  if (name === "bundle") {
  clearFx("bundle");
  fxBundle.classList.add("on");

  // sudden burst
  for (let i = 0; i < 34; i++) {
    setTimeout(spawnBundleItem, i * 25);
  }

  // continue briefly
  timers.bundle = setInterval(spawnBundleItem, 130);

  // stop after 6 seconds
  setTimeout(() => clearFx("bundle"), 6000);
}

}


  if (name === "flowers"){
    fxFlowers.classList.add("on");
    clearFx("flowers");
    fxFlowers.classList.add("on");
    timers.flowers = setInterval(spawnFlowerOrHeart, 420);
    setTimeout(()=>clearFx("flowers"), 7000);
  }

  if (name === "future"){
    fxFuture.classList.add("on");
    clearFx("future");
    fxFuture.classList.add("on");
    timers.future = setInterval(spawnSpark, 260);
    setTimeout(()=>clearFx("future"), 6000);
  }
}

const loveLetterSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">
  <rect x="10" y="18" width="100" height="60" rx="14" fill="rgba(255,255,255,.95)" stroke="rgba(255,95,154,.55)" stroke-width="4"/>
  <path d="M16 28 L60 56 L104 28" fill="none" stroke="rgba(255,95,154,.65)" stroke-width="4" stroke-linecap="round"/>
  <path d="M20 70 L55 48" fill="none" stroke="rgba(255,95,154,.35)" stroke-width="4" stroke-linecap="round"/>
  <path d="M100 70 L65 48" fill="none" stroke="rgba(255,95,154,.35)" stroke-width="4" stroke-linecap="round"/>
  <path d="M66 58c0 8-6 14-14 14s-14-6-14-14c0-6 4-10 8-10 3 0 5 2 6 4 1-2 3-4 6-4 4 0 8 4 8 10z"
        fill="rgba(255,95,154,.65)"/>
</svg>
`);

const tinyFlowerSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="10" fill="rgba(194,24,58,.35)"/>
  <ellipse cx="50" cy="28" rx="18" ry="14" fill="rgba(255,160,200,.85)"/>
  <ellipse cx="72" cy="50" rx="18" ry="14" fill="rgba(255,120,170,.70)"/>
  <ellipse cx="50" cy="72" rx="18" ry="14" fill="rgba(255,160,200,.80)"/>
  <ellipse cx="28" cy="50" rx="18" ry="14" fill="rgba(255,120,170,.65)"/>
</svg>
`);

// heart is built with CSS (no svg needed)
function spawnBundleItem() {
  const types = ["letter", "flower", "heart"];
  const t = types[Math.floor(rand(0, types.length))];

  const el = document.createElement("div");
  el.className = "fxItem";
  el.style.position = "absolute";
  el.style.left = `${rand(0, 100)}vw`;
  el.style.top  = `${rand(0, 100)}vh`;
  el.style.opacity = "0.95";

  // size
  let size;
  if (t === "letter") size = rand(34, 58);
  if (t === "flower") size = rand(18, 34);
  if (t === "heart")  size = rand(14, 26);

  el.style.width = `${size}px`;
  el.style.height = `${size}px`;

  if (t === "letter") {
    el.style.backgroundImage = `url("data:image/svg+xml,${loveLetterSvg}")`;
    el.style.backgroundSize = "contain";
    el.style.backgroundRepeat = "no-repeat";
    el.style.filter = "drop-shadow(0 8px 16px rgba(255,95,154,.25))";
  }

  if (t === "flower") {
    el.style.backgroundImage = `url("data:image/svg+xml,${tinyFlowerSvg}")`;
    el.style.backgroundSize = "contain";
    el.style.backgroundRepeat = "no-repeat";
    el.style.filter = "drop-shadow(0 6px 12px rgba(255,95,154,.18))";
  }

  if (t === "heart") {
    // heart made from CSS shapes
    el.style.background = "rgba(255,95,154,.55)";
    el.style.transform = "rotate(45deg)";
    el.style.borderRadius = "3px";
    el.innerHTML = `
      <span style="position:absolute;width:100%;height:100%;border-radius:50%;background:inherit;left:-50%;top:0"></span>
      <span style="position:absolute;width:100%;height:100%;border-radius:50%;background:inherit;left:0;top:-50%"></span>
    `;
    el.style.filter = "drop-shadow(0 8px 16px rgba(255,95,154,.18))";
  }

  // movement
  const driftX = rand(-140, 140);
  const driftY = rand(-260, -520);
  const dur = rand(3.8, 6.8);
  const rot = rand(-25, 25);

  el.animate([
    { transform: `translate(0,0) rotate(${rot}deg)`, opacity: 0 },
    { transform: `translate(${driftX/3}px, ${driftY/3}px) rotate(${rot/2}deg)`, opacity: 0.98, offset: 0.2 },
    { transform: `translate(${driftX}px, ${driftY}px) rotate(${rot}deg)`, opacity: 0 }
  ], { duration: dur * 1000, easing: "ease-in-out", fill: "forwards" });

  fxBundle.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000 + 200);
}




// butterfly svg
const butterflySvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">
  <!-- left wing -->
  <ellipse cx="40" cy="40" rx="32" ry="22" fill="#ffb6c9"/>
  <ellipse cx="40" cy="40" rx="20" ry="14" fill="#ffd6e7"/>

  <!-- right wing -->
  <ellipse cx="80" cy="40" rx="32" ry="22" fill="#ff9fba"/>
  <ellipse cx="80" cy="40" rx="20" ry="14" fill="#ffd6e7"/>

  <!-- body -->
  <rect x="56" y="30" width="8" height="30" rx="4" fill="#c2183a"/>

  <!-- antenna -->
  <path d="M60 30 Q50 10 40 12" stroke="#c2183a" stroke-width="2" fill="none"/>
  <path d="M60 30 Q70 10 80 12" stroke="#c2183a" stroke-width="2" fill="none"/>
</svg>
`);


function spawnButterfly() {
  const el = document.createElement("div");
  el.className = "fxItem";
  el.style.position = "absolute";
  el.style.left = `${rand(0, 100)}vw`;
  el.style.top  = `${rand(0, 100)}vh`;   // anywhere on screen

  const size = rand(50, 90);
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.backgroundImage = `url("data:image/svg+xml,${butterflySvg}")`;
  el.style.backgroundSize = "contain";
  el.style.backgroundRepeat = "no-repeat";
  el.style.opacity = "0.9";

  const driftX = rand(-120, 120);
  const driftY = rand(-220, -420); // mostly upward
  const dur = rand(3.5, 6.5);
  const rot = rand(-30, 30);

  el.animate([
    { transform:`translate(0,0) rotate(${rot}deg)`, opacity: 0 },
    { transform:`translate(${driftX/3}px, ${driftY/3}px) rotate(${rot/2}deg)`, opacity: 0.95, offset: 0.2 },
    { transform:`translate(${driftX}px, ${driftY}px) rotate(${rot}deg)`, opacity: 0 }
  ], { duration: dur * 1000, easing: "ease-in-out", fill: "forwards" });

  fxButterflies.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000 + 200);
}


// flower svg
const flowerSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
  <circle cx="14" cy="14" r="3.2" fill="rgba(194,24,58,.35)"/>
  <path d="M14 4c2.1 1.4 3.5 3.5 3.8 6-2.6-.2-4.8-1.6-6-3.8.6-.9 1.3-1.6 2.2-2.2z"
    fill="rgba(255,160,200,.75)"/>
  <path d="M24 14c-1.4 2.1-3.5 3.5-6 3.8.2-2.6 1.6-4.8 3.8-6 .9.6 1.6 1.3 2.2 2.2z"
    fill="rgba(255,120,170,.60)"/>
  <path d="M14 24c-2.1-1.4-3.5-3.5-3.8-6 2.6.2 4.8 1.6 6 3.8-.6.9-1.3 1.6-2.2 2.2z"
    fill="rgba(255,160,200,.70)"/>
  <path d="M4 14c1.4-2.1 3.5-3.5 6-3.8-.2 2.6-1.6 4.8-3.8 6-.9-.6-1.6-1.3-2.2-2.2z"
    fill="rgba(255,120,170,.55)"/>
</svg>
`);

function spawnFlowerOrHeart(){
  const el = document.createElement("div");
  el.className = "fxItem";
  const isFlower = Math.random() < 0.55;

  const size = isFlower ? rand(16, 30) : rand(10, 22);
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.left = `${rand(0, 100)}vw`;
  el.style.top = `${rand(75, 115)}vh`;

  if (isFlower){
    el.style.backgroundImage = `url("data:image/svg+xml,${flowerSvg}")`;
    el.style.backgroundSize = "contain";
    el.style.backgroundRepeat = "no-repeat";
  } else {
    el.style.background = ["rgba(255,90,150,.55)","rgba(255,160,200,.55)","rgba(210,30,70,.30)"][Math.floor(rand(0,3))];
    el.style.transform = "rotate(45deg)";
    el.style.borderRadius = "3px";
    el.innerHTML = `<span style="position:absolute;width:100%;height:100%;border-radius:50%;background:inherit;left:-50%;top:0"></span>
                    <span style="position:absolute;width:100%;height:100%;border-radius:50%;background:inherit;left:0;top:-50%"></span>`;
  }

  const dur = rand(7, 12);
  const drift = rand(-80, 80);
  const rot = rand(-40, 40);

  el.animate([
    { transform:`translate(0,0) rotate(${rot}deg)`, opacity:0.0 },
    { transform:`translate(${drift/4}px,-20vh) rotate(${rot/2}deg)`, opacity:0.9, offset:0.18 },
    { transform:`translate(${drift}px,-120vh) rotate(${rot}deg)`, opacity:0.0 }
  ], { duration: dur*1000, easing:"ease-in-out", fill:"forwards" });

  fxFlowers.appendChild(el);
  setTimeout(() => el.remove(), dur*1000 + 250);
}

function spawnSpark(){
  const el = document.createElement("div");
  el.className = "fxItem";
  const size = rand(4, 7);
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = "999px";
  el.style.background = ["rgba(255,255,255,.8)","rgba(255,160,200,.85)","rgba(255,120,170,.75)"][Math.floor(rand(0,3))];
  el.style.left = `${rand(10, 90)}vw`;
  el.style.top = `${rand(70, 95)}vh`;

  const dur = rand(2.8, 4.2);
  const driftX = rand(-40, 40);

  el.animate([
    { transform:"translate(0,0)", opacity:0.0 },
    { transform:`translate(${driftX/3}px,-10vh)`, opacity:0.9, offset:0.2 },
    { transform:`translate(${driftX}px,-40vh)`, opacity:0.0 }
  ], { duration: dur*1000, easing:"ease-out", fill:"forwards" });

  fxFuture.appendChild(el);
  setTimeout(() => el.remove(), dur*1000 + 100);
}

// ---------- confetti (hearts + bows) ----------
const canvas = $("confetti");
const ctx = canvas.getContext("2d");

function resize(){
  const r = canvas.getBoundingClientRect();
  canvas.width = Math.floor(r.width * devicePixelRatio);
  canvas.height = Math.floor(r.height * devicePixelRatio);
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
window.addEventListener("resize", resize);
resize();

function drawHeart(x,y,s,rot,color){
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(rot);
  ctx.scale(s,s);
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(0, 0.3);
  ctx.bezierCurveTo(0, 0, -0.5, 0, -0.5, 0.3);
  ctx.bezierCurveTo(-0.5, 0.55, -0.25, 0.75, 0, 0.95);
  ctx.bezierCurveTo(0.25, 0.75, 0.5, 0.55, 0.5, 0.3);
  ctx.bezierCurveTo(0.5, 0, 0, 0, 0, 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawBow(x,y,s,rot,color){
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(rot);
  ctx.scale(s,s);
  ctx.fillStyle = color;

  ctx.beginPath(); // left loop
  ctx.moveTo(-0.9, 0);
  ctx.bezierCurveTo(-1.3,-0.35,-1.25,0.35,-0.9,0);
  ctx.bezierCurveTo(-0.55,-0.35,-0.55,0.35,-0.9,0);
  ctx.closePath(); ctx.fill();

  ctx.beginPath(); // right loop
  ctx.moveTo(0.9, 0);
  ctx.bezierCurveTo(1.3,-0.35,1.25,0.35,0.9,0);
  ctx.bezierCurveTo(0.55,-0.35,0.55,0.35,0.9,0);
  ctx.closePath(); ctx.fill();

  ctx.beginPath(); // knot
  ctx.ellipse(0,0,0.25,0.18,0,0,Math.PI*2);
  ctx.fill();

  ctx.beginPath(); // tails
  ctx.moveTo(-0.1,0.12); ctx.lineTo(-0.35,0.75); ctx.lineTo(-0.05,0.65); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0.1,0.12); ctx.lineTo(0.35,0.75); ctx.lineTo(0.05,0.65); ctx.closePath(); ctx.fill();

  ctx.restore();
}

let parts = [];
let running = false;

function launch(){
  parts = [];
  const colors = ["rgba(255,90,150,.9)","rgba(255,160,200,.9)","rgba(210,30,70,.55)","rgba(255,120,170,.85)"];
  const w = canvas.getBoundingClientRect().width;

  for (let i=0;i<110;i++){
    const isBow = Math.random() < 0.30;
    parts.push({
      type: isBow ? "bow" : "heart",
      x: rand(0,w),
      y: rand(-20,-260),
      vy: rand(1.1,3.1),
      vx: rand(-0.7,0.7),
      rot: rand(0,Math.PI*2),
      vr: rand(-0.045,0.045),
      size: rand(10,18),
      color: colors[Math.floor(rand(0,colors.length))]
    });
  }
  running = true;
  setTimeout(()=>running=false, 9000);
}

function tick(){
  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;
  ctx.clearRect(0,0,w,h);

  parts.forEach(p=>{
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    const sc = p.size/22;
    if (p.type === "heart") drawHeart(p.x,p.y,sc,p.rot,p.color);
    else drawBow(p.x,p.y,sc,p.rot,p.color);

    if (p.y > h + 30){
      if (running){
        p.y = rand(-30,-220);
        p.x = rand(0,w);
      }
    }
  });

  // clear out after done
  if (!running) parts = parts.filter(p => p.y < h + 40);

  requestAnimationFrame(tick);
}
tick();

document.querySelectorAll(".yesBtn").forEach(b=>{
  b.addEventListener("click", ()=>{
    $("yesMsg").hidden = false;
    launch();
    $("yesMsg").scrollIntoView({behavior:"smooth", block:"center"});
  });
});
