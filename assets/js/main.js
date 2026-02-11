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

/* Header spacer: escribe --header-h según el alto real del header */
(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let t;

  const syncHeaderHeight = () => {
    const h = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--header-h", `${h}px`);
  };

  window.addEventListener("load", syncHeaderHeight);
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(syncHeaderHeight, 120);
  });

  if ("ResizeObserver" in window) {
    new ResizeObserver(syncHeaderHeight).observe(header);
  }
})();

// Traductor premium (UI) + Google Translate (cookie)
(function () {
  const toggle = document.getElementById("langToggle");
  const menu = document.getElementById("langMenu");
  const current = document.getElementById("langCurrent");

  if (!toggle || !menu || !current) return;

  function setCookie(name, value) {
    document.cookie = `${name}=${value}; path=/; max-age=31536000`;
  }

  function getCookie(name) {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith(name + "="))
      ?.split("=")[1];
  }

  function setLang(lang) {
    setCookie("googtrans", `/es/${lang}`);
    location.reload();
  }

  function paintCurrent(lang) {
    if (!lang) {
      current.textContent = "ES";
      return;
    }
    // Google usa "uk" para ucraniano, pero tú quieres mostrar "UA"
    if (lang === "uk") {
      current.textContent = "UA";
    } else {
      current.textContent = lang.toUpperCase();
    }
  }

  // Abrir/cerrar menú
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Cerrar por click fuera
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Elegir idioma
  menu.querySelectorAll(".lang-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      paintCurrent(lang);   // <-- aquí
      setLang(lang);
    });
  });

  // Mostrar idioma actual (cookie)
  const gt = getCookie("googtrans");
  if (gt) {
    const lang = decodeURIComponent(gt).split("/")[2];
    paintCurrent(lang);    // <-- y aquí
  } else {
    paintCurrent("es");
  }
})();
