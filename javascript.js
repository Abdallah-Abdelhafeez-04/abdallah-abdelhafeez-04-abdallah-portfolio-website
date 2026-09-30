// ==========================================================================
// Abdallah Abdelhafeez - Portfolio Interactivity Script
// Smooth responsive navigation, active link detection, contact form handler
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle("active");
      menuToggle.classList.toggle("open", isOpen);
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close menu when clicking any nav link
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close menu on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 2. Active Navigation Highlight
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navItems = document.querySelectorAll(".nav-links a");

  navItems.forEach(link => {
    const linkHref = link.getAttribute("href");
    if (!linkHref) return;

    // Normalizing href for comparison
    const linkPath = linkHref.split("/").pop().toLowerCase();
    const cleanCurrent = currentPath.toLowerCase();

    if (
      (cleanCurrent === "" && linkPath === "index.html") ||
      (cleanCurrent === "index.html" && linkPath === "index.html") ||
      cleanCurrent === linkPath
    ) {
      navItems.forEach(item => item.classList.remove("active"));
      link.classList.add("active");
    }
  });

  // 3. Scroll to Top Floating Button
  let scrollBtn = document.getElementById("scrollTopBtn");
  if (!scrollBtn) {
    scrollBtn = document.createElement("button");
    scrollBtn.id = "scrollTopBtn";
    scrollBtn.setAttribute("aria-label", "Scroll to top");
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollBtn);
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollBtn.style.display = "flex";
    } else {
      scrollBtn.style.display = "none";
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 4. Contact Form Handler (on contact.html)
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const subjectInput = document.getElementById("subject");
      const messageInput = document.getElementById("message");

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const subject = subjectInput ? subjectInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.textContent = "Please fill in all required fields.";
          formStatus.className = "form-status error";
        }
        return;
      }

      // Compose mailto fallback link to ensure message can be sent directly
      const mailtoSubject = encodeURIComponent(subject || `Message from ${name} via Portfolio`);
      const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoLink = `mailto:abdallahabdelhafeez2004@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      if (formStatus) {
        formStatus.textContent = "Thank you! Opening your email client to send the message...";
        formStatus.className = "form-status success";
      }

      // Open mail client
      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 600);

      contactForm.reset();
    });
  }
});
