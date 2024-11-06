// Configuration
const SECTIONS = [
    { id: "home", text: "Friends." },
    { id: "studio", text: "Reign." },
    { id: "contact", text: "Contact." },
  ];

  // DOM Elements
  const logoDynamic = document.getElementById("logo-dynamic");
  const customCursor = document.querySelector(".custom-cursor");
  const cursorElements = document.querySelectorAll('[data-cursor="true"]');
  let currentSectionIndex = 0;
  let isTransitioning = false;

  // Section Management
  function changeSection(sectionId, dynamicText) {
    if (isTransitioning) return;
    isTransitioning = true;

    // Update sections
    document.querySelectorAll(".section").forEach((section) => {
      section.classList.remove("active");
    });
    document.getElementById(sectionId).classList.add("active");

    // Update logo text with animation
    updateLogoText(dynamicText);

    // Update theme
    document.body.classList.toggle("dark-text", sectionId === "studio");

    setTimeout(() => {
      isTransitioning = false;
    }, 600);
  }

  function updateLogoText(newText) {
    logoDynamic.classList.add("fade-out");

    setTimeout(() => {
      logoDynamic.textContent = newText;
      logoDynamic.classList.remove("fade-out");
      logoDynamic.classList.add("fade-in");

      setTimeout(() => {
        logoDynamic.classList.remove("fade-in");
      }, 300);
    }, 300);
  }

  // Scroll Navigation
  function handleScroll(direction) {
    if (isTransitioning) return;

    currentSectionIndex =
      (currentSectionIndex + direction + SECTIONS.length) % SECTIONS.length;
    const { id, text } = SECTIONS[currentSectionIndex];
    changeSection(id, text);
  }

  // Cursor Management
  function updateCursorPosition(e) {
    if (!customCursor) return;

    const x = e.clientX - customCursor.offsetWidth / 2;
    const y = e.clientY - customCursor.offsetHeight / 2;

    customCursor.style.left = `${x}px`;
    customCursor.style.top = `${y}px`;
  }

  function toggleCursor(show) {
    if (!customCursor) return;

    const bodyStyles = getComputedStyle(document.body);
    const backgroundColor = getComputedStyle(
      document.querySelector(".section.active")
    ).backgroundColor;

    if (show) {
      // Définir la couleur du fond du curseur
      customCursor.style.backgroundColor = bodyStyles.color;

      // Gérer spécifiquement les cas de couleur pour le texte
      if (backgroundColor === "rgb(247, 247, 247)") {
        // #f7f7f7
        customCursor.style.color = "#f7f7f7";
      } else if (backgroundColor === "rgb(248, 96, 62)") {
        // #f8603e
        customCursor.style.color = "#f8603e";
      } else {
        customCursor.style.color = bodyStyles.backgroundColor;
      }

      customCursor.style.opacity = "1";
    } else {
      customCursor.style.opacity = "0";
    }
  }

  // Event Listeners
  document.addEventListener("DOMContentLoaded", () => {
    // Navigation click events
    document.querySelectorAll("[data-section]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const sectionId = link.dataset.section;
        const sectionData = SECTIONS.find((s) => s.id === sectionId);
        if (sectionData) {
          currentSectionIndex = SECTIONS.findIndex(
            (s) => s.id === sectionId
          );
          changeSection(sectionId, sectionData.text);
        }
      });
    });

    // Cursor events
    cursorElements.forEach((element) => {
      element.addEventListener("mouseenter", () => toggleCursor(true));
      element.addEventListener("mouseleave", () => toggleCursor(false));
    });

    // Scroll event with debounce
    let scrollTimeout;
    window.addEventListener(
      "wheel",
      (e) => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          handleScroll(e.deltaY > 0 ? 1 : -1);
        }, 50);
      },
      { passive: true }
    );

    // Mouse move for cursor
    document.addEventListener("mousemove", updateCursorPosition);
  });
