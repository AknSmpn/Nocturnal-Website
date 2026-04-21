let stream           = null;
let selectedLayout   = null;
let selectedEffect   = "normal";
let photos           = [];
let totalShots       = 0;
let currentShot      = 0;
let uploadedFileName = null;
let animFrame        = null;
let decoInterval     = null;

const isMobile = window.innerWidth <= 600;

/* ========================
   LAYOUT CONFIG (20)
======================== */
const LAYOUTS = [
  { id: "strip3",     shots: 3, label: "Classic Strip",  desc: "3 foto vertikal",
    preview: `<div class="layout-preview strip3-preview"><div class="lp-box tall"></div><div class="lp-box tall"></div><div class="lp-box tall"></div></div>` },
  { id: "grid4",      shots: 4, label: "Grid 2×2",       desc: "4 foto kotak",
    preview: `<div class="layout-preview grid4-preview"><div class="lp-box"></div><div class="lp-box"></div><div class="lp-box"></div><div class="lp-box"></div></div>` },
  { id: "big1small2", shots: 3, label: "Featured",       desc: "1 besar + 2 kecil",
    preview: `<div class="layout-preview big1small2-preview"><div class="lp-box big"></div><div class="lp-col"><div class="lp-box sm"></div><div class="lp-box sm"></div></div></div>` },
  { id: "strip2wide", shots: 2, label: "Duo Wide",       desc: "2 foto landscape",
    preview: `<div class="layout-preview strip2wide-preview"><div class="lp-box wide"></div><div class="lp-box wide"></div></div>` },
  { id: "diagonal",   shots: 3, label: "Trio Offset",    desc: "3 foto versetzt",
    preview: `<div class="layout-preview diagonal-preview"><div class="lp-box"></div><div class="lp-box shift"></div><div class="lp-box"></div></div>` },
  { id: "single",     shots: 1, label: "Solo",           desc: "1 foto besar",
    preview: `<div class="layout-preview single-preview"><div class="lp-box"></div></div>` },
  { id: "strip4",     shots: 4, label: "Strip 4",        desc: "4 foto vertikal",
    preview: `<div class="layout-preview strip4-preview"><div class="lp-box"></div><div class="lp-box"></div><div class="lp-box"></div><div class="lp-box"></div></div>` },
  { id: "triptych",   shots: 3, label: "Triptych",       desc: "3 kolom landscape",
    preview: `<div class="layout-preview triptych-preview"><div class="lp-box"></div><div class="lp-box"></div><div class="lp-box"></div></div>` },
  { id: "banner",     shots: 2, label: "Banner",         desc: "1 besar + 1 tipis",
    preview: `<div class="layout-preview banner-preview"><div class="lp-box banner-big"></div><div class="lp-box banner-sm"></div></div>` },
  { id: "mosaic",     shots: 3, label: "Mosaic",         desc: "1 lebar + 2 kotak",
    preview: `<div class="layout-preview mosaic-preview"><div class="lp-box m-wide"></div><div class="lp-box m-half"></div><div class="lp-box m-half"></div></div>` },
  { id: "stack",      shots: 2, label: "Stack",          desc: "1 besar + 1 tipis bawah",
    preview: `<div class="layout-preview stack-preview"><div class="lp-box stack-lg"></div><div class="lp-box stack-sm"></div></div>` },
  { id: "row3",       shots: 3, label: "Row Featured",   desc: "1 besar + 2 kanan",
    preview: `<div class="layout-preview row3-preview"><div class="lp-box r3-main"></div><div class="lp-box r3-sm"></div></div>` },
  { id: "cinema",     shots: 2, label: "Cinema",         desc: "2 foto sinematik",
    preview: `<div class="layout-preview cinema-preview"><div class="lp-box wide"></div><div class="lp-box wide"></div></div>` },
  { id: "quad",       shots: 4, label: "Quad Portrait",  desc: "4 foto portrait",
    preview: `<div class="layout-preview quad-preview"><div class="lp-box"></div><div class="lp-box"></div><div class="lp-box"></div><div class="lp-box"></div></div>` },
  { id: "cross",      shots: 4, label: "Cross",          desc: "4 foto silang",
    preview: `<div class="layout-preview cross-preview"><div class="lp-box"></div><div class="lp-box"></div><div class="lp-box cross-center"></div><div class="lp-box"></div></div>` },
  { id: "polaroid",   shots: 1, label: "Polaroid",       desc: "gaya polaroid klasik",
    preview: `<div class="layout-preview polaroid-preview"><div class="lp-box"></div></div>` },
  { id: "duov",       shots: 2, label: "Duo Portrait",   desc: "2 foto portrait",
    preview: `<div class="layout-preview duo-v-preview"><div class="lp-box"></div><div class="lp-box"></div></div>` },
  { id: "threecol",   shots: 3, label: "Three Column",   desc: "1 lebar + 2 sempit",
    preview: `<div class="layout-preview three-col-preview"><div class="lp-box tc-wide"></div><div class="lp-box tc-sm"></div><div class="lp-box tc-sm"></div></div>` },
  { id: "frame",      shots: 1, label: "Framed",         desc: "foto dengan bingkai pink",
    preview: `<div class="layout-preview frame-preview"><div class="lp-box frame-border"></div><div class="lp-box frame-main"></div></div>` },
  { id: "strip3alt",  shots: 3, label: "Strip Alt",      desc: "3 foto + border putih",
    preview: `<div class="layout-preview strip3-preview"><div class="lp-box tall"></div><div class="lp-box tall"></div><div class="lp-box tall"></div></div>` },
];

/* ========================
   EFFECT CONFIG (20)
======================== */
const EFFECTS = [
  { id: "normal",    label: "Normal",     cls: "ef-normal",    emoji: "🌸", filter: "none",                              deco: null },
  { id: "grayscale", label: "B&W",        cls: "ef-grayscale", emoji: "🎞️", filter: "grayscale(1)",                      deco: null },
  { id: "sepia",     label: "Sepia",      cls: "ef-sepia",     emoji: "☕", filter: "sepia(0.8)",                        deco: null },
  { id: "vintage",   label: "Vintage",    cls: "ef-vintage",   emoji: "📷", filter: "sepia(0.4) contrast(1.1) brightness(0.95)", deco: null },
  { id: "warm",      label: "Warm",       cls: "ef-warm",      emoji: "🌅", filter: "saturate(1.4) hue-rotate(-15deg) brightness(1.05)", deco: null },
  { id: "cool",      label: "Cool",       cls: "ef-cool",      emoji: "🧊", filter: "saturate(0.9) hue-rotate(20deg) brightness(1.05)", deco: null },
  { id: "pink",      label: "Pink",       cls: "ef-pink",      emoji: "🩷", filter: "saturate(1.3) hue-rotate(-30deg)", deco: null },
  { id: "dramatic",  label: "Dramatic",   cls: "ef-dramatic",  emoji: "🎭", filter: "contrast(1.4) brightness(0.85) saturate(1.2)", deco: null },
  { id: "soft",      label: "Soft",       cls: "ef-soft",      emoji: "🕊️", filter: "brightness(1.1) contrast(0.9) saturate(0.85)", deco: null },
  { id: "fade",      label: "Fade",       cls: "ef-fade",      emoji: "🌫️", filter: "brightness(1.2) contrast(0.75) saturate(0.7)", deco: null },
  { id: "hearts",    label: "Hearts",     cls: "ef-hearts",    emoji: "🩷", filter: "none",                              deco: "🩷💕🩷💕🩷" },
  { id: "stars",     label: "Stars",      cls: "ef-stars",     emoji: "⭐", filter: "none",                              deco: "⭐✨⭐✨⭐" },
  { id: "flowers",   label: "Flowers",    cls: "ef-flowers",   emoji: "🌸", filter: "none",                              deco: "🌸🌷🌸🌷🌸" },
  { id: "bokeh",     label: "Bokeh",      cls: "ef-bokeh",     emoji: "✨", filter: "brightness(1.05) contrast(0.95)",   deco: "✨💫✨💫✨" },
  { id: "sparkle",   label: "Sparkle",    cls: "ef-sparkle",   emoji: "💫", filter: "brightness(1.1) saturate(1.2)",     deco: "💫⭐💫⭐💫" },
  { id: "bubbles",   label: "Bubbles",    cls: "ef-bubbles",   emoji: "🫧", filter: "none",                              deco: "🫧🔵🫧🔵🫧" },
  { id: "snowflake", label: "Snow",       cls: "ef-snowflake", emoji: "❄️", filter: "brightness(1.1) saturate(0.8)",     deco: "❄️🌨️❄️🌨️❄️" },
  { id: "leaves",    label: "Leaves",     cls: "ef-leaves",    emoji: "🍃", filter: "hue-rotate(5deg) saturate(1.1)",    deco: "🍃🌿🍃🌿🍃" },
  { id: "rainbow",   label: "Rainbow",    cls: "ef-rainbow",   emoji: "🌈", filter: "saturate(1.5) brightness(1.05)",    deco: "🌈🌟🌈🌟🌈" },
  { id: "confetti",  label: "Confetti",   cls: "ef-confetti",  emoji: "🎊", filter: "none",                              deco: "🎊🎉🎊🎉🎊" },
];

/* ========================
   INIT — render cards
======================== */
document.addEventListener("DOMContentLoaded", () => {
  renderLayoutCards();
  renderEffectCards();
  if (typeof initGallery === "function") initGallery("photobooth", false);
});

function renderLayoutCards() {
  const grid = document.getElementById("layoutGrid");
  LAYOUTS.forEach((l, i) => {
    const card = document.createElement("div");
    card.className = "layout-card";
    card.style.animationDelay = (i * 0.04) + "s";
    card.innerHTML = `
      ${l.preview}
      <div class="layout-name">${l.label}</div>
      <div class="layout-desc">${l.desc}</div>
    `;
    card.onclick = () => selectLayout(l.id);
    grid.appendChild(card);
  });
}

function renderEffectCards() {
  const grid = document.getElementById("effectGrid");
  EFFECTS.forEach((e, i) => {
    const card = document.createElement("div");
    card.className = `effect-card ${e.cls}`;
    card.id = "ec-" + e.id;
    card.style.animationDelay = (i * 0.04) + "s";
    card.innerHTML = `
      <div class="effect-thumb">
        <div class="effect-thumb-inner">${e.emoji}</div>
      </div>
      <div class="effect-name">${e.label}</div>
    `;
    card.onclick = () => selectEffect(e.id);
    grid.appendChild(card);
  });
}

/* ========================
   SELECT LAYOUT
======================== */
window.selectLayout = function (id) {
  selectedLayout = id;
  const cfg = LAYOUTS.find(l => l.id === id);
  totalShots = cfg.shots;

  document.getElementById("stepLayout").style.display = "none";
  document.getElementById("stepEffect").style.display = "block";
};

/* ========================
   SELECT EFFECT
======================== */
window.selectEffect = function (id) {
  selectedEffect = id;
  document.querySelectorAll(".effect-card").forEach(c => c.classList.remove("selected"));
  document.getElementById("ec-" + id)?.classList.add("selected");
};

/* ========================
   GO TO CAMERA
======================== */
window.goToCamera = function () {
  photos      = [];
  currentShot = 0;

  const cfg = LAYOUTS.find(l => l.id === selectedLayout);
  document.getElementById("stepEffect").style.display  = "none";
  document.getElementById("stepCamera").style.display  = "block";
  document.getElementById("cameraTitle").textContent   = cfg.label;
  updateShotCounter();
  startCamera();
};

function updateShotCounter() {
  document.getElementById("shotCounter").textContent =
    `foto ${currentShot + 1} dari ${totalShots}`;
}

/* ========================
   BACK HANDLER
======================== */
window.handleBack = function () {
  const layout = document.getElementById("stepLayout");
  const effect = document.getElementById("stepEffect");
  const camera = document.getElementById("stepCamera");
  const result = document.getElementById("stepResult");

  if (effect.style.display !== "none") {
    effect.style.display = "none";
    layout.style.display = "block";
  } else if (camera.style.display !== "none") {
    stopCamera();
    camera.style.display = "none";
    effect.style.display = "block";
  } else if (result.style.display !== "none") {
    result.style.display = "none";
    layout.style.display = "block";
  } else {
    window.location.href = "menu2.html";
  }
};

/* ========================
   CAMERA
======================== */
async function startCamera() {
  try {
    const constraints = {
      audio: false,
      video: isMobile
        ? { facingMode: "user", aspectRatio: 9 / 16 }
        : { facingMode: "user", aspectRatio: 16 / 9 }
    };
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    const video = document.getElementById("video");
    video.srcObject = stream;
    video.onloadedmetadata = () => { startEffectLoop(); startDecoLoop(); };
  } catch (err) {
    alert("Kamera tidak bisa diakses.");
    console.error(err);
  }
}

function stopCamera() {
  if (animFrame)   { cancelAnimationFrame(animFrame); animFrame = null; }
  if (decoInterval){ clearInterval(decoInterval); decoInterval = null; }
  if (stream)      { stream.getTracks().forEach(t => t.stop()); stream = null; }
  document.getElementById("decoOverlay").innerHTML = "";
}

/* ========================
   EFFECT LOOP (canvas)
======================== */
function startEffectLoop() {
  const video  = document.getElementById("video");
  const canvas = document.getElementById("effectCanvas");
  const ctx    = canvas.getContext("2d");
  const eff    = EFFECTS.find(e => e.id === selectedEffect);

  if (!eff || eff.filter === "none") {
    canvas.style.display = "none";
    return;
  }
  canvas.style.display = "block";

  function draw() {
    canvas.width  = video.videoWidth  || video.clientWidth;
    canvas.height = video.videoHeight || video.clientHeight;
    ctx.filter = eff.filter;
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    animFrame = requestAnimationFrame(draw);
  }
  draw();
}

/* ========================
   DECO LOOP (floating emoji)
======================== */
function startDecoLoop() {
  const eff = EFFECTS.find(e => e.id === selectedEffect);
  const overlay = document.getElementById("decoOverlay");
  overlay.innerHTML = "";
  if (!eff || !eff.deco) return;

  const emojis = eff.deco.split("");

  decoInterval = setInterval(() => {
    const span = document.createElement("span");
    span.className = "deco-particle";
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left     = Math.random() * 90 + "%";
    span.style.fontSize = (14 + Math.random() * 16) + "px";
    span.style.animationDuration = (2 + Math.random() * 3) + "s";
    overlay.appendChild(span);
    setTimeout(() => span.remove(), 5000);
  }, 400);
}

/* ========================
   TAKE PHOTO
======================== */
window.takePhoto = async function () {
  const shutterBtn = document.getElementById("shutterBtn");
  const countdown  = document.getElementById("countdown");
  const video      = document.getElementById("video");
  const canvas     = document.getElementById("canvas");
  const eff        = EFFECTS.find(e => e.id === selectedEffect);

  shutterBtn.disabled = true;

  for (let i = 3; i >= 1; i--) {
    countdown.textContent = i;
    await wait(1000);
  }
  countdown.textContent = "✦";
  await wait(300);
  countdown.textContent = "";

  const baseW = isMobile ? 720  : 1280;
  const baseH = isMobile ? 1280 : 720;
  canvas.width  = baseW;
  canvas.height = baseH;

  const ctx = canvas.getContext("2d");
  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  // Apply filter saat capture
  if (eff && eff.filter !== "none") ctx.filter = eff.filter;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  photos.push(canvas.toDataURL("image/jpeg", 0.92));
  currentShot++;

  if (currentShot < totalShots) {
    updateShotCounter();
    shutterBtn.disabled = false;
  } else {
    shutterBtn.disabled = false;
    stopCamera();
    showResult();
  }
};

/* ========================
   SHOW RESULT
======================== */
function showResult() {
  document.getElementById("stepCamera").style.display = "none";
  document.getElementById("stepResult").style.display = "block";

  const strip = document.getElementById("strip");
  strip.innerHTML = "";
  strip.className = "pb-strip";

  const makeImg = (src, cls = "") => {
    const img = document.createElement("img");
    img.src = src;
    if (cls) img.className = cls;
    return img;
  };

  switch (selectedLayout) {
    case "strip3":
    case "strip3alt":
      strip.classList.add("result-strip3");
      photos.forEach(s => strip.appendChild(makeImg(s)));
      break;

    case "grid4":
    case "cross":
    case "quad":
      strip.classList.add(selectedLayout === "quad" ? "result-quad" : selectedLayout === "cross" ? "result-cross" : "result-grid4");
      photos.forEach(s => strip.appendChild(makeImg(s)));
      break;

    case "big1small2": {
      strip.classList.add("result-big1small2");
      strip.appendChild(makeImg(photos[0], "img-big"));
      const col = document.createElement("div");
      col.className = "img-col";
      col.appendChild(makeImg(photos[1], "img-sm"));
      col.appendChild(makeImg(photos[2], "img-sm"));
      strip.appendChild(col);
      break;
    }

    case "strip2wide":
    case "duov":
      strip.classList.add(selectedLayout === "duov" ? "result-duov" : "result-strip2wide");
      photos.forEach(s => strip.appendChild(makeImg(s)));
      break;

    case "diagonal":
      strip.classList.add("result-diagonal");
      photos.forEach(s => strip.appendChild(makeImg(s)));
      break;

    case "single":
    case "polaroid":
    case "frame":
      strip.classList.add(selectedLayout === "polaroid" ? "result-polaroid" : selectedLayout === "frame" ? "result-frame" : "result-single");
      strip.appendChild(makeImg(photos[0]));
      break;

    case "strip4":
      strip.classList.add("result-strip4");
      photos.forEach(s => strip.appendChild(makeImg(s)));
      break;

    case "triptych":
      strip.classList.add("result-triptych");
      photos.forEach(s => strip.appendChild(makeImg(s)));
      break;

    case "banner":
      strip.classList.add("result-banner");
      strip.appendChild(makeImg(photos[0], "img-banner-big"));
      strip.appendChild(makeImg(photos[1], "img-banner-sm"));
      break;

    case "mosaic": {
      strip.classList.add("result-mosaic");
      strip.appendChild(makeImg(photos[0], "img-wide"));
      strip.appendChild(makeImg(photos[1], "img-half"));
      strip.appendChild(makeImg(photos[2], "img-half"));
      break;
    }

    case "stack":
      strip.classList.add("result-stack");
      strip.appendChild(makeImg(photos[0], "img-lg"));
      strip.appendChild(makeImg(photos[1], "img-sm"));
      break;

    case "row3": {
      strip.classList.add("result-row3");
      strip.appendChild(makeImg(photos[0], "img-main"));
      strip.appendChild(makeImg(photos[1], "img-sm"));
      strip.appendChild(makeImg(photos[2], "img-sm"));
      break;
    }

    case "cinema":
      strip.classList.add("result-cinema");
      photos.forEach(s => strip.appendChild(makeImg(s)));
      break;

    case "threecol": {
      strip.classList.add("result-threecol");
      strip.appendChild(makeImg(photos[0], "img-tc-wide"));
      strip.appendChild(makeImg(photos[1], "img-tc-sm"));
      strip.appendChild(makeImg(photos[2], "img-tc-sm"));
      break;
    }
  }

  const brand = document.createElement("div");
  brand.className = "pb-brand";
  brand.textContent = "✦ nocturnal ✦";
  strip.appendChild(brand);
}

/* ========================
   html2canvas loader
======================== */
function loadHtml2Canvas() {
  return new Promise((resolve) => {
    if (window.html2canvas) return resolve();
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = resolve;
    document.head.appendChild(s);
  });
}

async function getStripCanvas() {
  await loadHtml2Canvas();
  return await html2canvas(document.getElementById("strip"), {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true
  });
}

/* ========================
   SAVE
======================== */
window.saveStrip = async function () {
  const c    = await getStripCanvas();
  const link = document.createElement("a");
  link.download = "nocturnal-photobooth.png";
  link.href     = c.toDataURL("image/png");
  link.click();
};

/* ========================
   UPLOAD
======================== */
window.uploadStrip = async function () {
  const status = document.getElementById("uploadStatus");
  status.textContent = "uploading...";

  const c        = await getStripCanvas();
  const fileName = "photobooth-" + Date.now() + ".png";

  c.toBlob(async (blob) => {
    const { error } = await supabaseClient.storage
      .from("images")
      .upload("photobooth/" + fileName, blob, { contentType: "image/png" });

    if (error) {
      status.textContent = "upload gagal: " + error.message;
    } else {
      uploadedFileName = fileName;
      status.textContent = "✦ uploaded!";
      document.getElementById("btnDeleteCloud").style.display = "inline-flex";
      if (typeof initGallery === "function") initGallery("photobooth", false);
    }
  }, "image/png");
};

/* ========================
   DELETE
======================== */
window.deleteStrip = async function () {
  if (!uploadedFileName) return;
  const status = document.getElementById("uploadStatus");
  status.textContent = "menghapus...";

  const { error } = await supabaseClient.storage
    .from("images")
    .remove(["photobooth/" + uploadedFileName]);

  if (error) {
    status.textContent = "gagal hapus: " + error.message;
  } else {
    uploadedFileName = null;
    status.textContent = "✦ foto dihapus";
    document.getElementById("btnDeleteCloud").style.display = "none";
    if (typeof initGallery === "function") initGallery("photobooth", false);
  }
};

/* ========================
   RETAKE
======================== */
window.retake = function () {
  document.getElementById("uploadStatus").textContent = "";
  document.getElementById("btnDeleteCloud").style.display = "none";
  document.getElementById("stepResult").style.display = "none";
  document.getElementById("stepLayout").style.display = "block";
  photos           = [];
  currentShot      = 0;
  selectedLayout   = null;
  selectedEffect   = "normal";
  uploadedFileName = null;
};

/* ========================
   HELPER
======================== */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}