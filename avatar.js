document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("avatar-toggle");
  const avatarContainer = document.getElementById("live2d-container");
  const avatarDialogue = document.getElementById("avatar-dialogue");
  let botResponses = {
    greeting: [
      "Hi there!",
      "Hello! How can I help?",
      "Welcome to Tanish's portfolio!",
    ],
    project: [
      "Check out my latest projects!",
      "I've been working on some cool stuff!",
      "Want to see what I've built?",
    ],
    contact: [
      "Let's connect!",
      "Feel free to reach out!",
      "I'd love to hear from you!",
    ],
    skills: [
      "I specialize in backend and API development.",
      "I'm proficient in several programming languages!",
      "Ask me about my technical skills!",
    ],
    random: [
      "Did you know I'm studying at IIITD?",
      "I love exploring new technologies!",
      "Fun fact: I built this website from scratch!",
    ],
  };

  // Track if scripts are already loaded to avoid duplicates
  window.pixiLoaded = window.pixiLoaded || false;
  window.live2dLoaded = window.live2dLoaded || false;

  // Avatar state
  let avatarState = {
    isVisible: false,
    isLoading: false,
    model: null,
    app: null,
  };

  // Enhanced toggle functionality
  toggleBtn.addEventListener("click", toggleAvatar);

  // Additional hover effect
  toggleBtn.addEventListener("mouseenter", () => {
    toggleBtn.classList.add("hover");
  });

  toggleBtn.addEventListener("mouseleave", () => {
    toggleBtn.classList.remove("hover");
  });

  // Close avatar when clicking outside
  document.addEventListener("click", (e) => {
    if (
      avatarState.isVisible &&
      !avatarContainer.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      hideAvatar();
    }
  });

  // Function to toggle avatar visibility
  function toggleAvatar() {
    if (avatarState.isVisible) {
      hideAvatar();
    } else {
      showAvatar();
    }
  }

  // Show avatar and load if needed
  function showAvatar() {
    avatarContainer.style.display = "flex";
    avatarContainer.classList.add("avatar-visible");
    toggleBtn.classList.add("active");
    avatarState.isVisible = true;

    // Display loading message
    setMessage("Loading my avatar...");

    // Only load scripts if they haven't been loaded yet
    if (!window.pixiLoaded) {
      loadPixiJS()
        .then(() => {
          window.pixiLoaded = true;
          return loadLive2DLibrary();
        })
        .then(() => {
          window.live2dLoaded = true;
          initLive2DAvatar();
        })
        .catch((error) => {
          console.error("Error loading Live2D:", error);
          setMessage(
            "Oops! I couldn't load properly. But you can still chat with me!"
          );
        });
    } else if (!avatarState.model) {
      initLive2DAvatar();
    } else {
      // Avatar is already loaded, show a greeting
      showRandomResponse("greeting");
    }
  }

  // Hide avatar
  function hideAvatar() {
    avatarContainer.classList.remove("avatar-visible");
    setTimeout(() => {
      if (!avatarState.isVisible) {
        avatarContainer.style.display = "none";
      }
    }, 300);
    toggleBtn.classList.remove("active");
    avatarState.isVisible = false;
  }

  // Load PIXI.js first
  function loadPixiJS() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.3.7/pixi.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  // Then load Live2D library
  function loadLive2DLibrary() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js";
      script.onload = () => {
        const pixiLive2d = document.createElement("script");
        pixiLive2d.src =
          "https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.4.0/dist/index.min.js";
        pixiLive2d.onload = resolve;
        pixiLive2d.onerror = reject;
        document.body.appendChild(pixiLive2d);
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  // Initialize the Live2D avatar
  function initLive2DAvatar() {
    if (avatarState.app) {
      avatarState.app.destroy(true);
    }

    const canvas = document.getElementById("live2d-canvas");

    // Create PIXI Application
    avatarState.app = new PIXI.Application({
      view: canvas,
      transparent: true,
      autoStart: true,
      width: 300,
      height: 400,
    });

    // Try multiple models in case one fails
    const modelOptions = [
      "https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/example/models/haru/haru_greeter_t03.model3.json",
      "https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/example/models/shizuku/shizuku.model.json",
      "https://unpkg.com/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json",
    ];

    // Try loading models in sequence until one works
    tryLoadModels(modelOptions, 0);
  }

  function tryLoadModels(models, index) {
    if (index >= models.length) {
      setMessage("I couldn't load my avatar, but I'm still here to help!");
      return;
    }

    setMessage("Loading my avatar... please wait!");

    PIXI.live2d.Live2DModel.from(models[index])
      .then((model) => {
        avatarState.model = model;

        // Set up the model
        model.scale.set(0.25);
        model.x = 150;
        model.y = 225;

        // Add to stage
        avatarState.app.stage.addChild(model);

        // Add interactivity
        model.on("hit", (hitAreas) => {
          if (hitAreas.includes("Head")) {
            showRandomResponse("greeting");
            playMotion(model, "tap_body");
          } else if (hitAreas.includes("Body")) {
            showRandomResponse("random");
            playMotion(model, "flick_head");
          }
        });

        // Make model look at cursor
        document
          .getElementById("live2d-canvas")
          .addEventListener("mousemove", (e) => {
            const rect = e.target.getBoundingClientRect();
            const point = {
              x: (e.clientX - rect.left) / model.scale.x,
              y: (e.clientY - rect.top) / model.scale.y,
            };
            model.focus(point.x, point.y);
          });

        // Start random idle motion
        if (model.internalModel && model.internalModel.motionManager) {
          model.internalModel.motionManager.startRandomMotion("idle", 2);
        }

        showRandomResponse("greeting");
      })
      .catch((err) => {
        console.error(`Failed to load model ${index}:`, err);
        // Try the next model
        tryLoadModels(models, index + 1);
      });
  }

  // Play a specific motion on the model
  function playMotion(model, motionGroup) {
    if (model.internalModel && model.internalModel.motionManager) {
      // First try the specific motion group
      if (model.internalModel.definitions.motions[motionGroup]) {
        model.internalModel.motionManager.startRandomMotion(motionGroup, 2);
      }
      // If not available, try a generic one
      else if (model.internalModel.definitions.motions.tap_body) {
        model.internalModel.motionManager.startRandomMotion("tap_body", 2);
      } else if (model.internalModel.definitions.motions.idle) {
        model.internalModel.motionManager.startRandomMotion("idle", 2);
      }
    }
  }

  // Update the message in the dialogue box
  function setMessage(message) {
    const messageElement = avatarDialogue.querySelector(".message");
    messageElement.textContent = message;
  }

  // Show a random response from a category
  function showRandomResponse(category) {
    const responses = botResponses[category] || botResponses.random;
    const randomIndex = Math.floor(Math.random() * responses.length);
    setMessage(responses[randomIndex]);
  }

  // Add input functionality to chat with the avatar
  function setupChatInput() {
    // Create chat input if it doesn't exist
    if (!document.getElementById("avatar-chat-input")) {
      const inputContainer = document.createElement("div");
      inputContainer.className = "avatar-chat-input-container";

      const input = document.createElement("input");
      input.id = "avatar-chat-input";
      input.type = "text";
      input.placeholder = "Ask me something...";

      const sendBtn = document.createElement("button");
      sendBtn.innerHTML = "Send";
      sendBtn.className = "avatar-chat-send";

      inputContainer.appendChild(input);
      inputContainer.appendChild(sendBtn);
      avatarDialogue.appendChild(inputContainer);

      // Handle input submission
      function handleInputSubmit() {
        const userInput = input.value.trim().toLowerCase();
        if (!userInput) return;

        input.value = "";

        // Simple response logic based on keywords
        if (userInput.includes("project") || userInput.includes("work")) {
          showRandomResponse("project");
          navigateTo("#portfolio");
        } else if (
          userInput.includes("contact") ||
          userInput.includes("email") ||
          userInput.includes("reach")
        ) {
          showRandomResponse("contact");
          navigateTo("#contact");
        } else if (userInput.includes("home") || userInput.includes("about")) {
          navigateTo("#hero");
          setMessage("Welcome to my portfolio!");
        } else if (userInput.includes("skill") || userInput.includes("know")) {
          showRandomResponse("skills");
        } else if (userInput.includes("hello") || userInput.includes("hi")) {
          showRandomResponse("greeting");
        } else {
          setMessage(
            "I'm still learning! Try asking about my projects, skills, or how to contact me."
          );
        }

        // Play talking motion
        if (avatarState.model) {
          playMotion(avatarState.model, "tap_body");
        }
      }

      sendBtn.addEventListener("click", handleInputSubmit);
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleInputSubmit();
      });
    }
  }

  // Add chat input after a short delay
  setTimeout(setupChatInput, 1000);
});

// Navigation function available globally
function navigateTo(sectionId) {
  document.querySelector(sectionId).scrollIntoView({ behavior: "smooth" });

  // Visual feedback on navigation
  const section = document.querySelector(sectionId);
  section.classList.add("section-highlight");
  setTimeout(() => {
    section.classList.remove("section-highlight");
  }, 1000);
}
