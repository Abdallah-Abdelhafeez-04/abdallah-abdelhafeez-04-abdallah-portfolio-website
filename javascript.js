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

  // 4. Contact Form Handler (FormSubmit AJAX API with direct Gmail delivery)
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const subjectInput = document.getElementById("subject");
      const messageInput = document.getElementById("message");
      const submitBtn = document.getElementById("submitBtn") || contactForm.querySelector('button[type="submit"]');

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

      // Prepare UI for sending
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "Send Message";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
      }

      if (formStatus) {
        formStatus.textContent = "Sending your message...";
        formStatus.className = "form-status info";
      }

      const mailtoSubject = encodeURIComponent(subject || `Message from ${name} via Portfolio`);
      const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoLink = `mailto:abdallahabdelhafeez2004@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      try {
        const response = await fetch("https://formsubmit.co/ajax/abdallahabdelhafeez2004@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: subject ? `${subject} (from ${name})` : `New message from ${name} via Portfolio`,
            message: message,
            _template: "table",
            _captcha: "false"
          })
        });

        const data = await response.json();

        if (data.success === "true" || data.success === true) {
          if (formStatus) {
            formStatus.textContent = "✔ Thank you! Your message has been sent successfully. I will get back to you soon!";
            formStatus.className = "form-status success";
          }
          contactForm.reset();
        } else if (data.message && data.message.toLowerCase().includes("activation")) {
          // One-time activation required by FormSubmit
          if (formStatus) {
            formStatus.textContent = "An activation link was sent to abdallahabdelhafeez2004@gmail.com. Please click 'Activate Form' in your email to receive direct messages.";
            formStatus.className = "form-status info";
          }
          contactForm.reset();
        } else {
          throw new Error(data.message || "Failed to deliver message");
        }
      } catch (err) {
        console.error("Form submission error:", err);
        if (formStatus) {
          formStatus.innerHTML = `⚠️ Direct delivery encountered an issue. <a href="${mailtoLink}" style="color: var(--primary-color); text-decoration: underline; font-weight: 600;">Click here to send via email client</a>.`;
          formStatus.className = "form-status error";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }
});
