import { scrollTopBtn } from "./index.js";

// Show scroll to top button
export function showScrollBtn() {
  if (document.documentElement.scrollTop > 40 || document.body.scrollTop > 40) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
}

// Scroll to top of the page
export function scrollToTop() {
  document.body.scrollIntoView({
    behavior: "smooth",
  });
}
