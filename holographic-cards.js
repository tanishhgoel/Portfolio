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

  // Project data - updated with your actual projects from the text portfolio PDF
  const projects = [
    {
      title: "Angry Birds Game",
      description:
        "Built the game using LibGDX to implement the GUI. Used Object-Oriented Programming concepts to implement a scalable model and represented those in a UML Diagram.",
      image: "image1.png", // Your actual image
      link: "https://github.com/Adamya10000/angry_birds",
      color: "#ff9500", // Orange accent color
      technologies: ["UML", "Use Case", "LIBGDX"],
    },
    {
      title: "RISCV Assembler & Simulator",
      description:
        "Built a RISC-V Assembler and Simulator in Python, implementing load/store operations, binary operations, and ISA handling to simulate instruction execution.",
      image: "image2.jpg", // Your actual image
      link: "https://github.com/tanishhgoel/RISCV",
      color: "#ff9500",
      technologies: ["Python", "ISA", "CO"],
    },
    {
      title: "ByteMe Canteen System",
      description:
        "Developed a canteen management system with CLI (Java) and GUI (JavaFX) integration, enabling data transfer through file handling and efficient management using multithreading.",
      image: "image3.png", // Your actual image
      link: "https://github.com/tanishhgoel/ByteMe-CLI-GUI/tree/master",
      color: "#ff9500",
      technologies: ["JavaFX", "Java", "CLI", "GUI"],
    },
    {
      title: "TEDx Poster",
      description:
        "Followed the classic Red and Black Tedx theme to create a poster for TEDxIIITD using Figma tools and Adobe Illustrator.",
      image: "image4.png", // Your actual image
      link: "https://pin.it/5kf5g06Ct",
      color: "#ff9500",
      technologies: ["Figma", "Illustrator"],
    },
    {
      title: "TEDx Ticket",
      description:
        "Followed the classic Red and Black Tedx theme to create a ticket for TEDxIIITD using Figma tools and Adobe Illustrator.",
      image: "image5.png", // Your actual image
      link: "https://pin.it/6ssr1mAor",
      color: "#ff9500",
      technologies: ["Figma", "Illustrator"],
    },
  ];

  // Create holographic cards for each project
  projects.forEach((project, index) => {
    // Create main card container
    const card = document.createElement("div");
    card.className = "holographic-card";
    card.dataset.index = index;

    // Create inner card content (front side) - now with project info
    const cardFront = document.createElement("div");
    cardFront.className = "holographic-front";

    // Add content to front side
    cardFront.innerHTML = `
      <div class="holo-frame">
        <div class="holo-content">
          <h3>${project.title}</h3>
          <p class="project-description">${project.description}</p>
          <div class="tech-list-container">
            <h4>Technologies:</h4>
            <ul class="tech-list">
              ${project.technologies
                .map((tech) => `<li class="tech-item">${tech}</li>`)
                .join("")}
            </ul>
          </div>
          <a href="${
            project.link
          }" class="holo-button" target="_blank">View Project</a>
          <div class="holo-scanline"></div>
        </div>
      </div>
    `;

    // Create back side of card (flipped state) with only the image
    const cardBack = document.createElement("div");
    cardBack.className = "holographic-back";

    // Add content to back side with larger image as the main focus
    cardBack.innerHTML = `
      <div class="holo-frame">
        <div class="holo-content full-image">
          <img src="${project.image}" alt="${project.title}" class="holo-project-image">
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
