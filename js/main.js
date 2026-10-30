/* =========================
   HEADER SCROLL
========================= */
const header = document.getElementById("bx-header");

if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("bx-scrolled", window.scrollY > 50);
  });
}

/* =========================
   WOW ANIMATIONS
========================= */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof WOW !== "undefined") {
    new WOW({
      boxClass: "wow",
      animateClass: "animated",
      offset: 50,
      mobile: true,
      live: true
    }).init();
  } else {
    console.error("WOW.js is not loaded.");
  }

  /* =========================
     GLIGHTBOX
  ========================= */
  if (typeof GLightbox !== "undefined") {
    GLightbox({
      selector: ".glightbox",
      loop: true,
      touchNavigation: true
    });
  }
});

/* =========================
   JEWELLERY SLIDER
========================= */
const slides = [
  {
    color: "#8a5a2b",
    title: "The Gemstone Edit",
    sub: "Where Every Stone Tells a Story",
    desc: "Discover extraordinary gemstones transformed into jewellery designed to be treasured for generations.",
    cta: "Discover Gemstones",
    bg: "linear-gradient(135deg, #3a2a1a, #6b4a2a)",
    bgImg: "assets/images/hore/Rectangle1.jpg",
    card: "linear-gradient(160deg, #1a1230, #6b5a3a)",
    cardImg:"assets/images/hore/step-1.jpg",
    label: "The Gemstone Collection"
  },
  {
    color: "#5a0a28",
    title: "Timeless. Distinctive. Yours.",
    sub: "Designed to Be Remembered",
    desc: "Contemporary jewellery crafted with exceptional gemstones and an enduring sense of elegance.",
    cta: "Shop New Arrivals",
    bg: "linear-gradient(135deg, #2a1020, #5a1a30)",
    bgImg: "assets/images/hore/Rectangle2.jpg",
    card: "linear-gradient(160deg, #a8957a, #c9a85a)",
     cardImg:"assets/images/hore/step-2.jpg",
    label: "Timeless Elegance"
  },
  {
    color: "#777b9a",
    title: "Crafted in Jaipur",
    sub: "Heritage, Reimagined",
    desc: "The artistry of Jaipur meets contemporary design in jewellery created for today's celebrations.",
    cta: "Discover the Collection",
    bg: "linear-gradient(135deg, #333344, #777b9a)",
    bgImg: "assets/images/hore/Rectangle3.jpg",
    card: "linear-gradient(160deg, #d8b070, #b88a4a)",
     cardImg:"assets/images/hore/step-3.jpg",
    label: "Jaipur Heritage"
  }
];

const $ = id => document.getElementById(id);

const track = $("track");
const bgs = $("bgs");
const panel = $("panel");
const hero = document.querySelector(".hero");

if (track && bgs && panel && hero) {
  let index = 0;
  let busy = false;
  let unlockTimer;

  // Create cards and background slides
  slides.forEach(s => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.setProperty("--g", s.card);

    card.innerHTML = `
      <div class="card-art" style="background-image: url('${s.cardImg}');">
        <div class="gem"></div>
      </div>
      <div class="card-label">
        <h3>${s.label}</h3>
      </div>
    `;

    track.appendChild(card);

    const layer = document.createElement("div");
    layer.className = "sl below";

    layer.innerHTML = `
      <div class="img"
           style="background-image: url('${s.bgImg}'), ${s.bg};">
      </div>
      <div class="line"></div>
      <div class="line b"></div>
      <div class="copy">
        <h2>${s.title}</h2>
        <h3>${s.sub}</h3>
        <p>${s.desc}</p>
        <button class="cta" type="button">${s.cta}</button>
      </div>
    `;

    bgs.appendChild(layer);
  });

  const cards = [...track.children];
  const layers = [...bgs.children];

  function place() {
    if (!cards.length) return;

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const distance = cardWidth + gap;

    cards.forEach(card => {
      card.style.transform = `translateX(${-index * distance}px)`;
    });
  }

  function go(direction, first = false) {
    if (busy && !first) return;

    const nextIndex = first
      ? 0
      : Math.max(0, Math.min(index + direction, slides.length - 1));

    if (!first && nextIndex === index) return;

    busy = true;
    clearTimeout(unlockTimer);

    const oldLayer = layers[index];
    index = nextIndex;

    const slide = slides[index];
    const incoming = layers[index];

    panel.style.background = slide.color;

    if (first) {
      incoming.className = "sl cur";
    } else {
      oldLayer.className =
        "sl " + (direction > 0 ? "above" : "below");

      incoming.style.transition = "none";
      incoming.className =
        "sl " + (direction > 0 ? "below" : "above");

      const image = incoming.querySelector(".img");
      const copy = incoming.querySelector(".copy");

      image.style.transition = "none";
      copy.style.transition = "none";

      copy.querySelectorAll("*").forEach(el => {
        el.style.transition = "none";
      });

      void incoming.offsetWidth;

      incoming.style.transition = "";
      image.style.transition = "";
      copy.style.transition = "";

      copy.querySelectorAll("*").forEach(el => {
        el.style.transition = "";
      });

      incoming.className = "sl cur";

      cards.forEach(card => {
        card.classList.remove("wipe-next", "wipe-prev");
      });

      cards[index].style.setProperty("--wipe", slide.color);
      void cards[index].offsetWidth;

      cards[index].classList.add(
        direction > 0 ? "wipe-next" : "wipe-prev"
      );
    }

    place();

    if ($("prev")) $("prev").disabled = index === 0;
    if ($("next")) $("next").disabled = index === slides.length - 1;

    if (first) {
      busy = false;
    } else {
      unlockTimer = setTimeout(() => {
        busy = false;
      }, 1150);
    }
  }

  if ($("next")) $("next").addEventListener("click", () => go(1));
  if ($("prev")) $("prev").addEventListener("click", () => go(-1));

  window.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  });

  let startX = null;
  let startY = null;

  hero.addEventListener("pointerdown", event => {
    startX = event.clientX;
    startY = event.clientY;
  });

  hero.addEventListener("pointerup", event => {
    if (startX === null || startY === null) return;

    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }

    startX = null;
    startY = null;
  });

  hero.addEventListener("pointercancel", () => {
    startX = null;
    startY = null;
  });

  window.addEventListener("resize", place);

  go(0, true);
}