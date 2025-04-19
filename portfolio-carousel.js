document.addEventListener("DOMContentLoaded", () => {
  // Wait for DOM to be fully loaded
  setupPortfolioCarousel();
});

function setupPortfolioCarousel() {
  // Get the projects container
  const projectsContainer = document.querySelector(".projects-container");
  if (!projectsContainer) return;

  // Replace the existing content with our carousel
  projectsContainer.innerHTML = "";
  projectsContainer.classList.add("carousel-container");

  // Create carousel track to hold the bubbles
  const carouselTrack = document.createElement("div");
  carouselTrack.className = "carousel-track";
  projectsContainer.appendChild(carouselTrack);

  // Project data - replace with your actual projects
  const projects = [
    {
      title: "Project 1",
      description:
        "Description of your amazing project goes here. This is the detailed view that appears when the bubble is in focus.",
      link: "#",
      color: "rgba(255, 165, 0, 0.2)", // Orange with low opacity
    },
    {
      title: "Project 2",
      description:
        "Interactive web application with 3D elements and animations. Built with Three.js and modern JavaScript.",
      link: "#",
      color: "rgba(255, 165, 0, 0.25)",
    },
    {
      title: "Project 3",
      description:
        "E-commerce platform with custom animations and smooth user experience. Responsive design for all devices.",
      link: "#",
      color: "rgba(255, 165, 0, 0.3)",
    },
    {
      title: "Project 4",
      description:
        "Data visualization dashboard that presents complex information in an intuitive interface with interactive charts.",
      link: "#",
      color: "rgba(255, 165, 0, 0.35)",
    },
    {
      title: "Project 5",
      description:
        "Mobile-first portfolio site with custom animations and effects, showcasing creative development skills.",
      link: "#",
      color: "rgba(255, 165, 0, 0.4)",
    },
  ];

  // Create bubble for each project
  projects.forEach((project, index) => {
    const bubble = document.createElement("div");
    bubble.className = "carousel-bubble";
    bubble.dataset.index = index;

    // Content inside bubble
    bubble.innerHTML = `
            <div class="bubble-content">
              <h3>${project.title}</h3>
              <p class="bubble-description">${project.description}</p>
              <a href="${project.link}" class="project-link">View Project</a>
            </div>
          `;

    // Set initial styles - all bubbles will be visible but positioned differently
    bubble.style.display = "flex";

    // Add click handler - now bubbles can be clicked to navigate
    bubble.addEventListener("click", (e) => {
      // Only navigate if clicking on the bubble itself (not a link)
      if (
        e.target.tagName !== "A" &&
        bubble.dataset.index != activeBubbleIndex
      ) {
        e.preventDefault();
        setActiveBubble(parseInt(bubble.dataset.index));
      }
    });

    carouselTrack.appendChild(bubble);
  });

  // Add bottom navigation container
  const navContainer = document.createElement("div");
  navContainer.className = "carousel-nav-container";

  // Add navigation controls
  const prevButton = document.createElement("button");
  prevButton.className = "carousel-nav prev";
  prevButton.innerHTML = "&lt;";
  prevButton.addEventListener("click", () => navigateCarousel("prev"));

  const nextButton = document.createElement("button");
  nextButton.className = "carousel-nav next";
  nextButton.innerHTML = "&gt;";
  nextButton.addEventListener("click", () => navigateCarousel("next"));

  // Add indicators to show current position
  const indicators = document.createElement("div");
  indicators.className = "carousel-indicators";

  for (let i = 0; i < projects.length; i++) {
    const dot = document.createElement("span");
    dot.className = "carousel-dot";
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => setActiveBubble(i));
    indicators.appendChild(dot);
  }

  // Add elements to the navigation container
  navContainer.appendChild(prevButton);
  navContainer.appendChild(indicators);
  navContainer.appendChild(nextButton);

  // Add navigation container to the projects container
  projectsContainer.appendChild(navContainer);

  // Set initial active bubble
  setActiveBubble(0);

  // Set up keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") navigateCarousel("prev");
    if (e.key === "ArrowRight") navigateCarousel("next");
  });

  // Add mouse wheel scrolling support with reduced sensitivity
  // CHANGED: Increased threshold by 5x from original
  let wheelDelta = 0;
  const wheelThreshold = 1100; // Significantly increased from original 100 (5x less sensitive)

  projectsContainer.addEventListener(
    "wheel",
    (e) => {
      // Only intercept if horizontal scroll is more significant than vertical
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();

        const delta = e.deltaX;
        wheelDelta += delta;

        if (Math.abs(wheelDelta) >= wheelThreshold) {
          if (wheelDelta > 0) {
            navigateCarousel("next");
          } else {
            navigateCarousel("prev");
          }
          wheelDelta = 0;
        }
      }
      // else let the page scroll vertically
    },
    { passive: false }
  );

  // Add touch/swipe support with increased threshold
  let touchStartX = 0;
  projectsContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  });

  projectsContainer.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    // Increased touch threshold to 150 (was 100)
    if (Math.abs(diff) > 150) {
      if (diff > 0) {
        navigateCarousel("next");
      } else {
        navigateCarousel("prev");
      }
    }
  });
}

// Current active bubble index
let activeBubbleIndex = 0;

function setActiveBubble(index) {
  const bubbles = document.querySelectorAll(".carousel-bubble");
  const dots = document.querySelectorAll(".carousel-dot");
  const totalBubbles = bubbles.length;

  if (index < 0 || index >= totalBubbles) return;

  // Update all bubbles with circular arc positioning
  bubbles.forEach((bubble, i) => {
    // Calculate relative position from active (-2, -1, 0, 1, 2)
    let relativePosition = (i - index + totalBubbles) % totalBubbles;
    if (relativePosition > totalBubbles / 2) relativePosition -= totalBubbles;

    // Scale, opacity, and z-index based on position
    let scale, opacity, zIndex, translateX, translateY, translateZ, rotateY;

    // Central bubble is full size, others are smaller
    scale = 1 - Math.min(Math.abs(relativePosition) * 0.15, 0.6);

    // Central bubble is fully opaque, others fade out
    // Central bubble is fully opaque, others fade out
    if (i === index) {
      opacity = 1;
    } else {
      opacity = 1 - Math.min(Math.abs(relativePosition) * 0.45, 0.9);
    }

    // Z-index ensures correct stacking
    zIndex = totalBubbles - Math.abs(relativePosition);

    // CHANGED: Increased X offset from 120px to 200px for better spacing
    // X position is offset from center
    translateX = relativePosition * 300 + "px";

    // CHANGED: Adjusted Y position for a better arc
    // Y position creates slight arc
    translateY = Math.abs(relativePosition) * 100 + "px";

    // CHANGED: Increased Z offset for more pronounced depth
    // Z position creates depth
    translateZ = -Math.abs(relativePosition) * 250 + "px";

    // Slight rotation for arc effect
    rotateY = -relativePosition * 15 + "deg";

    // Apply transforms
    bubble.style.transform = `translate3d(${translateX}, ${translateY}, ${translateZ}) scale(${scale}) rotateY(${rotateY})`;
    bubble.style.opacity = opacity;
    bubble.style.zIndex = zIndex;

    // Remove active class from all
    bubble.classList.remove("active");
    dots[i].classList.remove("active");
  });

  // Add active class to selected
  bubbles[index].classList.add("active");

  dots[index].classList.add("active");

  // Update the active index
  activeBubbleIndex = index;
}

function navigateCarousel(direction) {
  const bubbles = document.querySelectorAll(".carousel-bubble");
  const totalBubbles = bubbles.length;

  if (direction === "next") {
    setActiveBubble((activeBubbleIndex + 1) % totalBubbles);
  } else {
    setActiveBubble((activeBubbleIndex - 1 + totalBubbles) % totalBubbles);
  }
}
