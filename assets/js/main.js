(function () {
  "use strict";

  var root = document.documentElement;
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function stored() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }

  function syncTheme() {
    var dark = root.getAttribute("data-theme") === "dark";
    var toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(dark));
      toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#0c0c0d" : "#fbfbfa");
  }

  function setTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    if (persist) { try { localStorage.setItem("theme", theme); } catch (e) {} }
    syncTheme();
  }

  var toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    toggle.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
    });
  }

  // Follow the OS only while the visitor hasn't chosen a theme themselves.
  if (media.addEventListener) {
    media.addEventListener("change", function (e) {
      var s = stored();
      if (s !== "light" && s !== "dark") setTheme(e.matches ? "dark" : "light", false);
    });
  }

  syncTheme();

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  // Header hairline once scrolled (sentinel + IntersectionObserver, so there is
  // no scroll listener running on every frame).
  var header = document.querySelector(".site-header");
  if (header && "IntersectionObserver" in window) {
    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;";
    document.body.insertBefore(sentinel, document.body.firstChild);
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(sentinel);
  }

  // Reveal sections on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();

// Screenshot lightbox
(function () {
  "use strict";

  var lb = document.querySelector("[data-lightbox]");
  if (!lb) return;

  var imgEl = lb.querySelector("[data-lightbox-img]");
  var capEl = lb.querySelector("[data-lightbox-caption]");
  var list = [];
  var idx = 0;
  var lastFocus = null;

  function render() {
    if (!list.length) return;
    imgEl.src = list[idx];
    imgEl.alt = "Screenshot " + (idx + 1) + " of " + list.length;
    capEl.textContent = list.length > 1 ? (idx + 1) + " / " + list.length : "";
  }

  function open(items) {
    list = items;
    idx = 0;
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.classList.add("no-scroll");
    render();
    lb.querySelector("[data-lightbox-close]").focus();
  }

  function close() {
    lb.hidden = true;
    document.body.classList.remove("no-scroll");
    imgEl.removeAttribute("src");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(delta) {
    if (list.length < 2) return;
    idx = (idx + delta + list.length) % list.length;
    render();
  }

  document.querySelectorAll("[data-gallery]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var items = (btn.getAttribute("data-gallery") || "").split(",").filter(Boolean);
      if (items.length) open(items);
    });
  });

  lb.querySelector("[data-lightbox-close]").addEventListener("click", close);
  lb.querySelector("[data-lightbox-prev]").addEventListener("click", function () { step(-1); });
  lb.querySelector("[data-lightbox-next]").addEventListener("click", function () { step(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });
})();
