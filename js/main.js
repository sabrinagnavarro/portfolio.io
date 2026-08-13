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
});
