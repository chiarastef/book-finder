import { handleInput } from "./search-input.js";
import "../scss/style.scss";

export const searchBtn = document.querySelector("#searchBtn");

// Search subject inputted
searchBtn.addEventListener("click", (event) => handleInput(event));
