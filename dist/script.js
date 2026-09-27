(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealItems = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, revealObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );
    revealItems.forEach((item) => observer.observe(item));
  }

  const progress = document.querySelector("[data-progress]");
  if (progress) {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const value = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
      progress.style.width = `${value * 100}%`;
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  const preview = document.querySelector("[data-index-preview]");
  const projectRows = document.querySelectorAll("[data-preview]");
  if (preview && projectRows.length) {
    let swapTimer;
    projectRows.forEach((row) => {
      const swap = () => {
        const nextSource = row.dataset.preview;
        if (!nextSource || preview.getAttribute("src") === nextSource) return;
        window.clearTimeout(swapTimer);
        preview.classList.add("is-switching");
        swapTimer = window.setTimeout(() => {
          preview.src = nextSource;
          preview.onload = () => preview.classList.remove("is-switching");
        }, 150);
      };
      row.addEventListener("mouseenter", swap);
      row.addEventListener("focus", swap);
    });
  }

  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImage = document.querySelector("[data-lightbox-image]");
  const lightboxCaption = document.querySelector("[data-lightbox-caption]");
  const lightboxClose = document.querySelector("[data-lightbox-close]");

  if (lightbox && lightboxImage && lightboxCaption) {
    const openLightbox = (trigger) => {
      const image = trigger.matches("img") ? trigger : trigger.querySelector("img");
      if (!image) return;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt || "Expanded project image";
      lightboxCaption.textContent = trigger.dataset.caption || image.alt || "";
      lightbox.showModal();
      document.body.style.overflow = "hidden";
    };

    document.querySelectorAll("[data-enlarge]").forEach((trigger) => {
      trigger.setAttribute("tabindex", "0");
      trigger.setAttribute("role", "button");
      trigger.addEventListener("click", () => openLightbox(trigger));
      trigger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(trigger);
        }
      });
    });

    const closeLightbox = () => {
      lightbox.close();
      document.body.style.overflow = "";
      lightboxImage.removeAttribute("src");
    };

    lightboxClose?.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    lightbox.addEventListener("close", () => {
      document.body.style.overflow = "";
    });
  }
})();
