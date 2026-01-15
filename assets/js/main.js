// Cecilia Patiño — JS principal

// Menú hamburguesa (abrir/cerrar en móviles)
(function () {
  const hamburger = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu");
  if (!hamburger || !menu) return;

  hamburger.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("show");
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });
})();

// Deslizador Antes/Después (.ba) — tolerante a HTML sin handle/knob
(function () {
  document.querySelectorAll(".ba").forEach((wrap) => {
    const after = wrap.querySelector(".after");
    const range = wrap.querySelector('input[type="range"]');

    // crea la línea y el pomo si no existen
    let handle = wrap.querySelector(".handle");
    let knob = wrap.querySelector(".knob");

    if (!handle) {
      handle = document.createElement("div");
      handle.className = "handle";
      wrap.appendChild(handle);
    }
    if (!knob) {
      knob = document.createElement("div");
      knob.className = "knob";
      wrap.appendChild(knob);
    }

    if (!after || !range) return;

    const update = (val) => {
      const v = Math.max(0, Math.min(100, Number(val) || 50));
      const rightClip = 100 - v;
      after.style.clipPath = `inset(0 ${rightClip}% 0 0)`;
      handle.style.left = `${v}%`;
      knob.style.left = `${v}%`;
    };

    range.addEventListener("input", (e) => {
      update(e.target.value);
    });

    update(range.value || 50);
  });
})();

/* Lightbox sencillo */
(function () {
  const dlg = document.getElementById("lgx");
  const img = document.getElementById("lgx-img");
  const cap = document.getElementById("lgx-cap");
  const closeBtn = document.getElementById("lgx-close");

  // Si falta cualquier pieza del lightbox, no hacemos nada
  if (!dlg || !img || !cap || !closeBtn) return;

  document.querySelectorAll(".gallery-grid a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const href = a.getAttribute("href");
      const caption = a.getAttribute("data-caption") || "";
      img.src = href;
      img.alt = caption;
      cap.textContent = caption;
      dlg.showModal();
    });
  });

  function close() {
    dlg.close();
    img.src = "";
    img.alt = "";
    cap.textContent = "";
  }

  closeBtn.addEventListener("click", close);

  dlg.addEventListener("click", (ev) => {
    // cierra si clicas fuera de la imagen
    const rect = img.getBoundingClientRect();
    const inside =
      ev.clientX >= rect.left &&
      ev.clientX <= rect.right &&
      ev.clientY >= rect.top &&
      ev.clientY <= rect.bottom;
    if (!inside) close();
  });

  window.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") close();
  });
})();
