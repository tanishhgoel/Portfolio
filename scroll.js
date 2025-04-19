// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Get all sections
  const sections = document.querySelectorAll(".section");

  // Initialize section animations
  initSectionAnimations();

  // Setup project bubbles
  setupProjectBubbles();

  // Make the blob reveal follow scroll position as well as mouse
  updateBlobOnScroll();

  // Create scroll markers for better animation triggering
  createScrollMarkers();
});

function createScrollMarkers() {
  // Create hidden markers for precise scroll triggering
  const heroMarker = document.createElement("div");
  heroMarker.id = "hero-marker";
  heroMarker.style.position = "absolute";
  heroMarker.style.top = "95vh";
  heroMarker.style.visibility = "hidden";

  const portfolioMarker = document.createElement("div");
  portfolioMarker.id = "portfolio-marker";
  portfolioMarker.style.position = "absolute";
  portfolioMarker.style.top = "105vh";
  portfolioMarker.style.visibility = "hidden";

  document.body.appendChild(heroMarker);
  document.body.appendChild(portfolioMarker);
}

function initSectionAnimations() {
  // Hero section (already visible)
  gsap.from("#hero .content", {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power2.out",
  });

  // Portfolio section animation
  gsap.from("#portfolio .content", {
    opacity: 0,
    y: 100,
    duration: 1,
    scrollTrigger: {
      trigger: "#portfolio",
      start: "top 80%",
      end: "top 40%",
      scrub: true,
    },
  });

  // Project bubbles staggered animation
  gsap.from(".project-bubble", {
    scale: 0.5,
    opacity: 0,
    stagger: 0.2,
    duration: 1,
    scrollTrigger: {
      trigger: ".projects-container",
      start: "top 80%",
      end: "top 30%",
      scrub: true,
    },
  });

  // Contact section animation
  gsap.from("#contact .content", {
    opacity: 0,
    y: 100,
    duration: 1,
    scrollTrigger: {
      trigger: "#contact",
      start: "top 80%",
      end: "top 40%",
      scrub: true,
    },
  });

  // Contact form and info staggered animation
  gsap.from("#contact-form, .contact-info", {
    opacity: 0,
    x: function (i) {
      return i % 2 === 0 ? -50 : 50;
    },
    stagger: 0.3,
    duration: 1,
    scrollTrigger: {
      trigger: ".contact-container",
      start: "top 80%",
      end: "top 50%",
      scrub: true,
    },
  });
}

function setupProjectBubbles() {
  // Get all project bubbles
  const projectBubbles = document.querySelectorAll(".project-bubble");

  // Add hover effects with GSAP
  projectBubbles.forEach((bubble) => {
    bubble.addEventListener("mouseenter", () => {
      gsap.to(bubble, {
        backgroundColor: "rgba(255, 165, 0, 0.2)",
        scale: 1.05,
        duration: 0.3,
      });
    });

    bubble.addEventListener("mouseleave", () => {
      gsap.to(bubble, {
        backgroundColor: "rgba(255, 165, 0, 0.1)",
        scale: 1,
        duration: 0.3,
      });
    });
  });
}

function updateBlobOnScroll() {
  // This function modifies the existing blob behavior to also respond to scroll position
  window.addEventListener("scroll", () => {
    // Get the scroll position as a percentage of the page
    const scrollPercent =
      window.scrollY / (document.body.scrollHeight - window.innerHeight);

    // Create a "virtual" mouse position that also takes into account the scroll position
    const virtualMouseY = window.innerHeight * (0.5 + scrollPercent * 0.5);

    // Only update the Y position based on scroll, let the actual mousemove update the X
    if (typeof mouse !== "undefined") {
      // Keep the X position based on actual mouse, but influence Y by scroll
      mouse.y = mouse.y * 0.7 + virtualMouseY * 0.3;
    }
  });
}
