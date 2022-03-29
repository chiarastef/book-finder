import { handleInput } from "./search-input.js";
import { showScrollBtn } from "./scroll-to-top.js";
import { scrollToTop } from "./scroll-to-top.js";

import "../scss/style.scss";

export const searchBtn = document.querySelector("#searchBtn");
export const scrollTopBtn = document.querySelector("#scrollTop");

// Search subject inputted
searchBtn.addEventListener("click", (event) => handleInput(event));

// Show scroll to top button
document.addEventListener("scroll", showScrollBtn);

// Scroll to top when scroll to top button is clicked
scrollTopBtn.addEventListener("click", scrollToTop);
