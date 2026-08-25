// =========================================================
// PR PORTFOLIO TEMPLATE — NAV BEHAVIOR
// Handles: mobile hamburger toggle, dropdown open/close,
// click-outside-to-close, and Escape-to-close.
// No build step needed — plain JS, works as-is on GitHub Pages.
// =========================================================

// =========================================================
// METRICS SWITCH
// "disabled" — metric strips stay hidden site-wide (default).
// "enabled"  — they appear next to every element that has them.
// The markup lives in the HTML either way; this only toggles it.
// =========================================================
var METRICS = "disabled";

// Applied to <html> immediately (not on DOMContentLoaded) so the metrics
// never flash on screen before the switch is read.
if (METRICS === "enabled") {
  document.documentElement.classList.add("metrics-enabled");
}

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

  // Count-up metrics. Every .metric__value / .metric__delta already carries its
  // final number in the HTML (so it reads fine with JS off, or for a crawler).
  // Here we parse that text, rewind it to zero, and run it back up the first
  // time the metric scrolls into view.
  //
  // Formats handled, all inferred from the existing markup:
  //   1,240   grouped integer      12.4k  decimal + unit suffix
  //   7.9%    decimal + percent    +38%   signed prefix
  //   3:10    m:ss duration (counted in seconds, re-formatted on the way up)
  // Per-element overrides: data-count-from, data-count-duration (ms),
  // data-count="off" to leave a value alone.
  var countTargets = document.querySelectorAll(".metric__value, .metric__delta");

  if (countTargets.length && "IntersectionObserver" in window) {
    var COUNT_DURATION = 1200;

    // Splits "+38%" into prefix "+", number "38", suffix "%".
    var NUMBER_RE = /^([^0-9]*)([0-9][0-9,]*(?:\.[0-9]+)?)([^0-9]*)$/;
    var TIME_RE = /^(\d+):([0-5]\d)$/;

    function group(intPart) {
      return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function makeNumberFormatter(prefix, suffix, decimals, grouped) {
      return function (value) {
        var text = value.toFixed(decimals);
        if (grouped) {
          var parts = text.split(".");
          parts[0] = group(parts[0]);
          text = parts.join(".");
        }
        return prefix + text + suffix;
      };
    }

    function formatTime(seconds) {
      var whole = Math.round(seconds);
      var secs = whole % 60;
      return Math.floor(whole / 60) + ":" + (secs < 10 ? "0" : "") + secs;
    }

    function parseMetric(text) {
      var raw = text.trim();

      var time = raw.match(TIME_RE);
      if (time) {
        return { to: Number(time[1]) * 60 + Number(time[2]), format: formatTime };
      }

      var parts = raw.match(NUMBER_RE);
      if (!parts) return null;

      var digits = parts[2];
      var dot = digits.indexOf(".");
      return {
        to: Number(digits.replace(/,/g, "")),
        format: makeNumberFormatter(
          parts[1],
          parts[3],
          dot === -1 ? 0 : digits.length - dot - 1,
          digits.indexOf(",") !== -1
        )
      };
    }

    // easeOutCubic — quick off the line, settles gently on the final number.
    function ease(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    var reduceMotion = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

    var counters = [];

    countTargets.forEach(function (el) {
      if (el.getAttribute("data-count") === "off") return;

      var parsed = parseMetric(el.textContent);
      if (!parsed) return;

      var from = Number(el.getAttribute("data-count-from"));
      if (!isFinite(from)) from = 0;

      var duration = Number(el.getAttribute("data-count-duration"));
      if (!(duration > 0)) duration = COUNT_DURATION;

      counters.push({
        el: el,
        from: from,
        to: parsed.to,
        duration: duration,
        format: parsed.format,
        done: false
      });
    });

    if (counters.length) {
      var run = function (counter) {
        if (counter.done) return;
        counter.done = true;

        if (reduceMotion && reduceMotion.matches) {
          counter.el.textContent = counter.format(counter.to);
          return;
        }

        var start = null;
        var span = counter.to - counter.from;

        var step = function (now) {
          if (start === null) start = now;
          var progress = Math.min((now - start) / counter.duration, 1);
          counter.el.textContent = counter.format(counter.from + span * ease(progress));
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            // Back to natural sizing now that the widest string is in place,
            // so a later resize or zoom isn't held to a stale pixel width.
            counter.el.style.minWidth = "";
          }
        };

        requestAnimationFrame(step);
      };

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            var counter = entry.target.__counter;
            if (counter) run(counter);
          });
        },
        { threshold: 0.35 }
      );

      counters.forEach(function (counter) {
        // Pin the box to the width of the *final* string before rewinding, so a
        // narrow "0" doesn't shrink the column and reflow the row mid-count.
        var width = counter.el.getBoundingClientRect().width;

        // Zero width means the metric isn't being rendered at all — the most
        // common case being the METRICS switch left off, which hides every
        // strip. An unrendered element never intersects, so rewinding it to
        // zero would strand it there; leave the authored number alone.
        if (!width) return;

        counter.el.style.minWidth = width + "px";
        counter.el.textContent = counter.format(counter.from);
        counter.el.__counter = counter;
        observer.observe(counter.el);
      });
    }
  }
});
