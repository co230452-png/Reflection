/* =========================================================
   Reflections — small interaction script
   Handles: dark/light theme toggle (persisted), scroll-reveal
   for entry cards, header scroll progress bar, and back-to-top.
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const toggleBtn = document.getElementById("theme-toggle");
  const STORAGE_KEY = "reflections-theme";

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme"); // dark is default (no attribute)
    }
  }

  // Load saved preference, otherwise default to dark
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    applyTheme(saved);
  }

  toggleBtn.addEventListener("click", function () {
    const isLight = root.getAttribute("data-theme") === "light";
    const next = isLight ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  /* ---------- Scroll reveal for entries ---------- */
  const entries = document.querySelectorAll(".entry");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (items) {
        items.forEach(function (item, index) {
          if (item.isIntersecting) {
            // slight stagger for a calmer feel
            setTimeout(function () {
              item.target.classList.add("in-view");
            }, index * 60);
            observer.unobserve(item.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    entries.forEach(function (entry) {
      observer.observe(entry);
    });
  } else {
    // Fallback: just show everything
    entries.forEach(function (entry) {
      entry.classList.add("in-view");
    });
  }

  /* ---------- Header scroll progress bar ---------- */
  const progressBar = document.getElementById("header-progress-bar");

  function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = percent + "%";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
