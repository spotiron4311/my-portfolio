// Global variable to track the current section index
let currentSectionIndex = 0;

// 1. Navigation Bar and Slider Logic (UPDATED)
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav > ul");
  const items = document.querySelectorAll("nav > ul li a");
  const slider = document.getElementById("content-slider");
  let anim = null;
  let currentActiveItem = null;

  // --- Navigation Indicator Logic (Unchanged) ---
  const animate = (from, to) => {
    if (anim) clearInterval(anim);

    const start = Date.now();
    anim = setInterval(() => {
      const p = Math.min((Date.now() - start) / 500, 1);
      const e = 1 - Math.pow(1 - p, 3);

      const x = from + (to - from) * e;
      const y = -40 * (4 * e * (1 - e));
      const r = 200 * Math.sin(p * Math.PI);

      nav.style.setProperty("--translate-x", `${x}px`);
      nav.style.setProperty("--translate-y", `${y}px`);
      nav.style.setProperty("--rotate-x", `${r}deg`);

      if (p >= 1) {
        clearInterval(anim);
        anim = null;
        nav.style.setProperty("--translate-y", "0px");
        nav.style.setProperty("--rotate-x", "0deg");
      }
    }, 16);
  };

  const getCurrentPosition = () =>
    parseFloat(nav.style.getPropertyValue("--translate-x")) || 0;

  const getItemCenter = (item) => {
    return (
      item.getBoundingClientRect().left +
      item.offsetWidth / 2 -
      nav.getBoundingClientRect().left -
      5
    );
  };

  const moveToItem = (item) => {
    const current = getCurrentPosition();
    const center = getItemCenter(item);
    animate(current, center);
    nav.classList.add("show-indicator");
  };

  const setActiveItem = (item) => {
    if (currentActiveItem) {
      currentActiveItem.classList.remove("active");
    }

    currentActiveItem = item;
    item.classList.add("active");
    moveToItem(item);
  };

  const handleMouseLeave = () => {
    if (currentActiveItem) {
      moveToItem(currentActiveItem);
    } else {
      nav.classList.remove("show-indicator");
      if (anim) clearInterval(anim);
    }
  };
  // --- End Navigation Indicator Logic ---

  // --- Slider Logic (New/Updated) ---
  const slideTo = (targetIndex, item) => {
    if (targetIndex === currentSectionIndex) return;

    // Determine direction for animation logic (already handled by CSS transition)
    // The CSS transition on #content-slider handles the smooth horizontal movement.

    currentSectionIndex = targetIndex;

    // Calculate the required horizontal translation
    const translateValue = targetIndex * -100;
    slider.style.transform = `translateX(${translateValue}vw)`;

    setActiveItem(item);
  };

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => moveToItem(item));
    item.addEventListener("mouseleave", handleMouseLeave);
    item.addEventListener("click", (e) => {
      e.preventDefault();

      const targetIndex = parseInt(item.getAttribute("data-index"));

      // Slide the content
      slideTo(targetIndex, item);
    });
  });

  nav.addEventListener("mouseleave", handleMouseLeave);

  // Initialize active state and slide to 'Home' on page load
  if (items.length > 0) {
    setTimeout(() => {
      const homeLink =
        Array.from(items).find(
          (link) => link.getAttribute("data-index") === "0"
        ) || items[0];
      slideTo(0, homeLink);
    }, 100);
  }
  // --- End Slider Logic ---
});

// Typing animation
const texts = [
  "Full Stack Web Developer",
  "UI/UX Engineer",
  "Software Developer",
  "Programmer",
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
  const typingElement = document.getElementById("typingText");
  const currentText = texts[textIndex];

  if (isDeleting) {
    typingElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentText.length) {
    setTimeout(() => (isDeleting = true), 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
  }

  setTimeout(typeWriter, isDeleting ? 50 : 100);
}

// Start typing animation
typeWriter();

// Modal
// Initialize EmailJS
(function () {
  emailjs.init("wjZUu-SHwatJT42RM"); // Replace with your EmailJS public key
})();

// Contact Modal Functions
function openModal() {
  document.getElementById("modalOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById("modalOverlay").classList.remove("active");
  document.body.style.overflow = "auto";

  // Reset form and hide success message after modal closes
  setTimeout(() => {
    document.getElementById("contactForm").reset();
    document.getElementById("successMessage").classList.remove("show");
  }, 300);
}

function handleSubmit(event) {
  event.preventDefault();

  // Show loading state
  const submitBtn = document.querySelector(".submit-btn");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  // Get form data
  const formData = new FormData(event.target);
  const templateParams = {
    from_name: formData.get("name"),
    from_email: formData.get("email"),
    subject: formData.get("subject") || "Contact Form Submission",
    message: formData.get("message"),
    to_name: "JP Andal", // Your name
  };

  // Send email using EmailJS
  emailjs
    .send("service_y8px52b", "template_b5yzew9", templateParams)
    .then(function (response) {
      console.log("Email sent successfully!", response.status, response.text);

      // Show success message
      document.getElementById("successMessage").classList.add("show");

      // Reset form
      event.target.reset();

      // Auto-close modal after 3 seconds
      setTimeout(() => {
        closeModal();
      }, 3000);
    })
    .catch(function (error) {
      console.error("Failed to send email:", error);

      // Show error message
      alert(
        "Sorry, there was an error sending your message. Please try again or contact me directly."
      );
    })
    .finally(function () {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
}

// Close modal with Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});
(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'9885bd13e431b9f0',t:'MTc1OTQyNDI0NC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName("head")[0].appendChild(d);
    }
  }
  if (document.body) {
    var a = document.createElement("iframe");
    a.height = 1;
    a.width = 1;
    a.style.position = "absolute";
    a.style.top = 0;
    a.style.left = 0;
    a.style.border = "none";
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    if ("loading" !== document.readyState) c();
    else if (window.addEventListener)
      document.addEventListener("DOMContentLoaded", c);
    else {
      var e = document.onreadystatechange || function () {};
      document.onreadystatechange = function (b) {
        e(b);
        "loading" !== document.readyState &&
          ((document.onreadystatechange = e), c());
      };
    }
  }
})();
