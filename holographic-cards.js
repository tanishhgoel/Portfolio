// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the holographic project cards
  setupHolographicCards();
});

function setupHolographicCards() {
  // Get the projects container
  const projectsContainer = document.querySelector(".projects-container");
  if (!projectsContainer) return;

  // Replace the existing content with our holographic cards
  projectsContainer.innerHTML = "";
  projectsContainer.classList.add("holographic-container");

  // Project data - replace with your actual projects
  const projects = [
    {
      title: "Project 1",
      description:
        "Description of your amazing project goes here. This is the detailed view that appears when the hologram is activated.",
      image: "/api/placeholder/800/600", // Placeholder image
      link: "#project1",
      color: "#ff9500", // Orange accent color
    },
    {
      title: "Project 2",
      description:
        "Interactive web application with 3D elements and animations. Built with Three.js and modern JavaScript.",
      image: "/api/placeholder/800/600", // Placeholder image
      link: "#project2",
      color: "#ff9500",
    },
    {
      title: "Project 3",
      description:
        "E-commerce platform with custom animations and smooth user experience. Responsive design for all devices.",
      image: "/api/placeholder/800/600", // Placeholder image
      link: "#project3",
      color: "#ff9500",
    },
    {
      title: "Project 4",
      description:
        "Data visualization dashboard that presents complex information in an intuitive interface with interactive charts.",
      image: "/api/placeholder/800/600", // Placeholder image
      link: "#project4",
      color: "#ff9500",
    },
  ];

  // Create holographic cards for each project
  projects.forEach((project, index) => {
    // Create main card container
    const card = document.createElement("div");
    card.className = "holographic-card";
    card.dataset.index = index;

    // Create inner card content (front side)
    const cardFront = document.createElement("div");
    cardFront.className = "holographic-front";

    // Add content to front side
    cardFront.innerHTML = `
        <div class="holo-frame">
          <div class="holo-content">
            <h3>${project.title}</h3>
            <div class="holo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <div class="holo-scanline"></div>
          </div>
        </div>
      `;

    // Create back side of card (flipped state)
    const cardBack = document.createElement("div");
    cardBack.className = "holographic-back";

    // Add content to back side
    cardBack.innerHTML = `
        <div class="holo-frame">
          <div class="holo-content">
            <img src="${project.image}" alt="${project.title}" class="holo-project-image">
            <p>${project.description}</p>
            <a href="${project.link}" class="holo-button">View Project</a>
            <div class="holo-scanline"></div>
          </div>
        </div>
      `;

    // Create holographic overlay effect
    const holoOverlay = document.createElement("div");
    holoOverlay.className = "holo-overlay";

    // Create hologram projection light
    const holoLight = document.createElement("div");
    holoLight.className = "holo-light";

    // Append all elements to the card
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    card.appendChild(holoOverlay);
    card.appendChild(holoLight);

    // Add card to container
    projectsContainer.appendChild(card);

    // Set up event listeners for this card
    setupHolographicEffects(card);
  });

  // Add CSS styles for holographic effects
  addHolographicStyles();
}

function setupHolographicEffects(card) {
  // Initial variables
  let isExpanded = false;
  let isFlipped = false;

  // Define max rotation angles
  const maxRotationX = 15; // degrees
  const maxRotationY = 15; // degrees

  // Store card dimensions for calculations
  const rect = card.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Mouse move handler - desktop effect
  function handleMouseMove(e) {
    if (isExpanded) return; // Don't tilt if expanded

    // Calculate mouse position relative to card center
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Update card rect in case of page scroll or resize
    const updatedRect = card.getBoundingClientRect();
    const updatedCenterX = updatedRect.left + updatedRect.width / 2;
    const updatedCenterY = updatedRect.top + updatedRect.height / 2;

    // Calculate rotation angles based on mouse position
    const rotateY =
      (maxRotationY * (mouseX - updatedCenterX)) / (updatedRect.width / 2);
    const rotateX =
      (-maxRotationX * (mouseY - updatedCenterY)) / (updatedRect.height / 2);

    // Apply rotation transformation
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // Update light position to follow cursor
    const light = card.querySelector(".holo-light");
    if (light) {
      const lightX = ((mouseX - updatedRect.left) / updatedRect.width) * 100;
      const lightY = ((mouseY - updatedRect.top) / updatedRect.height) * 100;
      light.style.background = `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255, 165, 0, 0.8) 0%, rgba(255, 165, 0, 0.3) 20%, rgba(255, 165, 0, 0) 50%)`;
    }
  }

  // Touch handler for mobile
  function handleTouch(e) {
    e.preventDefault(); // Prevent default touch behavior

    if (!isExpanded) {
      // Expand the card on first tap
      expandCard();
    } else if (!isFlipped) {
      // Flip the card on second tap
      flipCard();
    } else {
      // Reset on third tap
      resetCard();
    }
  }

  // Click handler for desktop
  function handleClick(e) {
    // Only process if clicking the card itself, not links
    if (e.target.tagName !== "A") {
      if (!isExpanded) {
        expandCard();
      } else if (!isFlipped) {
        flipCard();
      } else {
        resetCard();
      }
    }
  }

  // Device orientation handler for mobile
  function handleDeviceOrientation(e) {
    if (isExpanded) return; // Don't tilt if expanded

    // Get device orientation data
    const beta = e.beta; // X-axis rotation (-180 to 180)
    const gamma = e.gamma; // Y-axis rotation (-90 to 90)

    // Limit rotation angles
    const rotateX = Math.max(Math.min(beta - 45, maxRotationX), -maxRotationX);
    const rotateY = Math.max(Math.min(gamma, maxRotationY), -maxRotationY);

    // Apply rotation transformation
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // Move light based on device orientation
    const light = card.querySelector(".holo-light");
    if (light) {
      const lightX = ((gamma + 90) / 180) * 100;
      const lightY = ((beta + 90) / 180) * 100;
      light.style.background = `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255, 165, 0, 0.8) 0%, rgba(255, 165, 0, 0.3) 20%, rgba(255, 165, 0, 0) 50%)`;
    }
  }

  // Expand card function
  function expandCard() {
    // Remove all card transforms
    document.querySelectorAll(".holographic-card").forEach((c) => {
      if (c !== card) {
        c.style.transform = "scale(0.8)";
        c.style.opacity = "0.5";
        c.style.pointerEvents = "none"; // Disable interaction with other cards
      }
    });

    // Expand this card
    card.style.transform = "perspective(1000px) scale(1.1)";
    card.classList.add("expanded");
    isExpanded = true;

    // Add hologram activation animation
    const holoOverlay = card.querySelector(".holo-overlay");
    if (holoOverlay) {
      holoOverlay.classList.add("active");
    }

    // Play hologram sound effect (optional)
    playHologramSound("activate");
  }

  // Flip card function
  function flipCard() {
    card.classList.add("flipped");
    isFlipped = true;
    playHologramSound("flip");
  }

  // Reset card function
  function resetCard() {
    // Reset all cards
    document.querySelectorAll(".holographic-card").forEach((c) => {
      c.style.transform = "perspective(1000px)";
      c.style.opacity = "1";
      c.style.pointerEvents = "auto";
      c.classList.remove("expanded");
    });

    // Reset this card
    card.classList.remove("flipped");
    const holoOverlay = card.querySelector(".holo-overlay");
    if (holoOverlay) {
      holoOverlay.classList.remove("active");
    }

    isExpanded = false;
    isFlipped = false;

    playHologramSound("deactivate");
  }

  // Play hologram sound effects (optional)
  function playHologramSound(type) {
    // Could implement sound effects here if desired
    // For now, just a placeholder function
  }

  // Reset state when mouse leaves
  function handleMouseLeave() {
    if (!isExpanded) {
      card.style.transform = "perspective(1000px)";

      // Reset light
      const light = card.querySelector(".holo-light");
      if (light) {
        light.style.background =
          "radial-gradient(circle at 50% 50%, rgba(255, 165, 0, 0.3) 0%, rgba(255, 165, 0, 0.1) 20%, rgba(255, 165, 0, 0) 50%)";
      }
    }
  }

  // Add all event listeners
  card.addEventListener("mousemove", handleMouseMove);
  card.addEventListener("mouseleave", handleMouseLeave);
  card.addEventListener("click", handleClick);
  card.addEventListener("touchstart", handleTouch, { passive: false });

  // Add device orientation handler for mobile devices
  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", handleDeviceOrientation);
  }
}

function addHolographicStyles() {
  // Add CSS if it doesn't already exist
  if (!document.getElementById("holographic-styles")) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "holographic-styles";
    styleSheet.innerHTML = `
        .holographic-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-top: 50px;
          perspective: 1000px;
        }
        
        .holographic-card {
          position: relative;
          width: 100%;
          height: 350px;
          transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
          transform: perspective(1000px);
          cursor: pointer;
        }
        
        .holographic-front,
        .holographic-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 15px;
          overflow: hidden;
          transform-style: preserve-3d;
        }
        
        .holographic-back {
          transform: rotateY(180deg);
        }
        
        .holographic-card.flipped {
          transform: perspective(1000px) rotateY(180deg) scale(1.1);
        }
        
        .holo-frame {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 2px solid rgba(255, 165, 0, 0.5);
          border-radius: 15px;
          box-shadow: 0 0 20px rgba(255, 165, 0, 0.3), inset 0 0 20px rgba(255, 165, 0, 0.2);
          overflow: hidden;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
        }
        
        .holo-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          padding: 25px;
          text-align: center;
          color: white;
        }
        
        .holo-content h3 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: #ff9500;
          text-shadow: 0 0 10px rgba(255, 165, 0, 0.5);
        }
        
        .holo-icon {
          width: 80px;
          height: 80px;
          margin: 20px 0;
        }
        
        .holo-icon svg {
          width: 100%;
          height: 100%;
          stroke: #ff9500;
          stroke-width: 2;
          filter: drop-shadow(0 0 5px rgba(255, 165, 0, 0.5));
        }
        
        .holo-project-image {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 15px;
          box-shadow: 0 0 20px rgba(255, 165, 0, 0.3);
        }
        
        .holo-button {
          display: inline-block;
          padding: 10px 20px;
          margin-top: 15px;
          background-color: #ff9500;
          color: #000;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          z-index: 10;
          box-shadow: 0 0 10px rgba(255, 165, 0, 0.5);
        }
        
        .holo-button:hover {
          background-color: #fff;
          color: #ff9500;
          transform: translateY(-3px);
        }
        
        .holo-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgba(255, 165, 0, 0) 0%, rgba(255, 165, 0, 0.1) 50%, rgba(255, 165, 0, 0) 100%);
          opacity: 0.5;
          pointer-events: none;
          transition: all 0.5s ease;
          mix-blend-mode: screen;
          transform: translateY(100%);
        }
        
        .holo-overlay.active {
          animation: holo-scan 3s linear infinite;
          opacity: 0.8;
          transform: translateY(0);
        }
        
        .holo-light {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          background: radial-gradient(circle at 50% 50%, rgba(255, 165, 0, 0.3) 0%, rgba(255, 165, 0, 0.1) 20%, rgba(255, 165, 0, 0) 50%);
          mix-blend-mode: screen;
          opacity: 0.7;
          transition: background 0.1s ease;
        }
        
        .holo-scanline {
          position: absolute;
          width: 100%;
          height: 4px;
          background: linear-gradient(to right, rgba(255, 165, 0, 0), rgba(255, 165, 0, 0.5), rgba(255, 165, 0, 0));
          animation: scanline 3s linear infinite;
          opacity: 0.5;
          pointer-events: none;
        }
        
        .holographic-card.expanded .holo-scanline {
          opacity: 0.8;
        }
        
        @keyframes holo-scan {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 200% 200%;
          }
        }
        
        @keyframes scanline {
          0% {
            top: 0%;
          }
          100% {
            top: 100%;
          }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .holographic-container {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }
          
          .holographic-card {
            height: 300px;
          }
          
          .holo-content h3 {
            font-size: 1.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .holographic-container {
            grid-template-columns: 1fr;
          }
          
          .holographic-card {
            height: 280px;
          }
        }
      `;

    document.head.appendChild(styleSheet);
  }
}
