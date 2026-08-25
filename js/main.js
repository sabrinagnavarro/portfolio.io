// =========================================================
// PR PORTFOLIO TEMPLATE — NAV BEHAVIOR
// Handles: mobile hamburger toggle, dropdown open/close,
// click-outside-to-close, and Escape-to-close.
// No build step needed — plain JS, works as-is on GitHub Pages.
// =========================================================
document.addEventListener("DOMContentLoaded", function () {
  var siteNav = document.querySelector(".site-nav");
  var hamburger = document.querySelector(".nav-hamburger");

  if (hamburger && siteNav) {
    hamburger.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  var dropdownItems = document.querySelectorAll(".nav-item.has-dropdown");

  dropdownItems.forEach(function (item) {
    var toggle = item.querySelector(".nav-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      var willOpen = !item.classList.contains("is-open");

      // Close any other open dropdowns first
      dropdownItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove("is-open");
          var otherToggle = other.querySelector(".nav-toggle");
          if (otherToggle) otherToggle.setAttribute("aria-expanded", "false");
        }
      });

      item.classList.toggle("is-open", willOpen);
      toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  // Click outside closes dropdowns (desktop) and the mobile menu
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-item")) {
      dropdownItems.forEach(function (item) {
        item.classList.remove("is-open");
        var toggle = item.querySelector(".nav-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    }
    if (siteNav && !e.target.closest(".site-nav") ) {
      siteNav.classList.remove("is-open");
      if (hamburger) hamburger.setAttribute("aria-expanded", "false");
    }
  });

  // Escape closes everything
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      dropdownItems.forEach(function (item) {
        item.classList.remove("is-open");
      });
      if (siteNav) siteNav.classList.remove("is-open");
    }
  });

  // Essay accordion (Quills and Nibs page)
  var essayItems = document.querySelectorAll(".essay-item");
  essayItems.forEach(function (item) {
    var toggle = item.querySelector(".essay-item__toggle");
    var panel = item.querySelector(".essay-item__panel");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", function () {
      var willOpen = !item.classList.contains("is-open");
      item.classList.toggle("is-open", willOpen);
      toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  // Lightbox — any <a data-lightbox href="...image"> opens in an overlay
  // instead of navigating to the bare image file.
  var lightboxLinks = document.querySelectorAll("a[data-lightbox]");
  if (lightboxLinks.length) {
    var overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.hidden = true;
    overlay.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="Close image">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
      '<img class="lightbox__img" alt="">';
    document.body.appendChild(overlay);

    var overlayImg = overlay.querySelector(".lightbox__img");
    var closeBtn = overlay.querySelector(".lightbox__close");
    var lastFocused = null;

    function openLightbox(href, alt) {
      overlayImg.src = href;
      overlayImg.alt = alt || "";
      overlay.hidden = false;
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function closeLightbox() {
      overlay.classList.remove("is-open");
      overlay.hidden = true;
      overlayImg.removeAttribute("src");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    lightboxLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        lastFocused = link;
        var img = link.querySelector("img");
        openLightbox(link.getAttribute("href"), img ? img.alt : "");
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    // Clicking the backdrop (but not the image itself) closes it
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) closeLightbox();
    });
  }

  // Horizontal carousel (Sarah's Social Strategy page).
  // Native scroll-snap does the swiping; JS only drives the arrows,
  // the dot indicators, and keyboard support.
  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    var track = carousel.querySelector("[data-carousel-track]");
    var prev = carousel.querySelector("[data-carousel-prev]");
    var next = carousel.querySelector("[data-carousel-next]");
    var dotsBox = carousel.querySelector("[data-carousel-dots]");
    if (!track) return;

    var slides = Array.prototype.slice.call(track.children);
    if (!slides.length) return;

    var dots = [];
    if (dotsBox) {
      slides.forEach(function () {
        var dot = document.createElement("span");
        dot.className = "carousel__dot";
        dotsBox.appendChild(dot);
        dots.push(dot);
      });
    }

    // Where the track lands when slide i is snapped into place. Centering is
    // clamped at both ends, since the first and last slide can never sit in
    // the middle of the track — deriving the index from these same targets
    // keeps the dots in sync with where the browser actually stops.
    function targetFor(i) {
      var slide = slides[i];
      var raw = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
      return Math.max(0, Math.min(raw, track.scrollWidth - track.clientWidth));
    }

    function currentIndex() {
      var best = 0;
      var bestDist = Infinity;
      for (var i = 0; i < slides.length; i++) {
        var dist = Math.abs(targetFor(i) - track.scrollLeft);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      return best;
    }

    function scrollToIndex(i) {
      var clamped = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: targetFor(clamped), behavior: "smooth" });
    }

    function sync() {
      var i = currentIndex();
      dots.forEach(function (dot, d) {
        dot.classList.toggle("is-active", d === i);
      });
      if (prev) prev.disabled = track.scrollLeft <= 1;
      if (next) {
        next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
      }
    }

    if (prev) prev.addEventListener("click", function () { scrollToIndex(currentIndex() - 1); });
    if (next) next.addEventListener("click", function () { scrollToIndex(currentIndex() + 1); });

    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); scrollToIndex(currentIndex() - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); scrollToIndex(currentIndex() + 1); }
    });

    var raf;
    track.addEventListener("scroll", function () {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    });
    window.addEventListener("resize", sync);
    sync();
  });
});
