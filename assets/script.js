/**
 * Personal Academic & Portfolio Website Scripts
 * Md.Abid Ullah Muhib
 */

// 1. Interactive features initialization
function initInteractiveFeatures() {
  // Dynamic copyright year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobile navigation drawer toggle
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    // Remove any previously attached listeners if re-initializing
    menuToggle.onclick = () => {
      navMenu.classList.toggle("open");
    };

    navMenu.querySelectorAll("a").forEach((link) => {
      link.onclick = () => navMenu.classList.remove("open");
    });
  }

  // Scroll reveal animation (IntersectionObserver)
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("show"));
  }
}

// 2. Modular block loader (for client-side dynamic inclusion)
async function loadModularComponents() {
  const includeElements = document.querySelectorAll("[data-include]");

  // If there are no data-include tags, the HTML is already compiled
  if (includeElements.length === 0) {
    initInteractiveFeatures();
    return;
  }

  // Load all components in parallel
  await Promise.all(
    Array.from(includeElements).map(async (el) => {
      const file = el.getAttribute("data-include");
      if (!file) return;
      try {
        const response = await fetch(file);
        if (!response.ok) {
          throw new Error(`Failed to load ${file}: HTTP ${response.status}`);
        }
        const html = await response.text();
        el.outerHTML = html;
      } catch (err) {
        console.error(`[Modular Loader] Error loading component ${file}:`, err);
      }
    })
  );

  // Initialize interactive features once components are in the DOM
  initInteractiveFeatures();
}

// Kick off when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadModularComponents);
} else {
  loadModularComponents();
}
