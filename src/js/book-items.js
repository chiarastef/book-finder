const _ = require("lodash");

import { form } from "./search-input.js";
import { searchBtn } from "./index.js";
import { getDescr } from "./axios-requests.js";

// Create searched subject element
export function showSearched(subj) {
  const subjSearched = document.createElement("div");
  subjSearched.innerText = `Subject searched: ${subj}`;

  form.append(subjSearched);

  // Delete subject searched text when the user clicks on search button again
  searchBtn.addEventListener("click", () => {
    subjSearched.remove();
  });
}

// Create book item
export function createBookItem(resp, num) {
  // Create single book item
  const bookItem = document.createElement("div");
  bookItem.classList.add("bookItem");

  form.after(bookItem);

  // Create book title element
  const titleEl = document.createElement("span");
  titleEl.classList.add("title");

  titleEl.textContent = _.get(resp.data, `works[${num}].title`, "");

  bookItem.append(titleEl);

  // Create book author element
  const authorEl = document.createElement("span");
  authorEl.classList.add("author");

  addAuthors(resp, num, authorEl);

  bookItem.append(authorEl);

  // Create expand button to show book cover and description
  const expandEl = document.createElement("button");
  expandEl.classList.add("expand");
  expandEl.innerHTML = `<span>Expand</span><i class="fa-solid fa-sort-down arrow-down"></i>`;
  expandEl.setAttribute("title", "Expand");

  bookItem.append(expandEl);

  // Get book cover ID
  const coverId = _.get(resp.data, `works[${num}].cover_id`, "");

  // Get book description
  getDescr(resp, num, coverId, bookItem, titleEl, authorEl, expandEl);

  // Delete book items when the user clicks on search button again
  searchBtn.addEventListener("click", () => {
    bookItem.remove();
  });
}

// Format author element
function addAuthors(resp, num, elem) {
  elem.textContent = "by ";

  // Check if author is listed
  if (resp.data == undefined || resp.data.works[num].authors.length == 0) {
    elem.textContent += "Unknown";
  }

  // Format author list
  resp.data.works[num].authors.forEach((author, index) => {
    // Check if there's more than one author
    if (resp.data.works[num].authors.length > 1) {
      // Add a comma after every author name except the last one
      if (resp.data.works[num].authors.length - 1 != index) {
        elem.textContent += `${author.name}, `;
      } else {
        elem.textContent += author.name;
      }
    } else {
      elem.textContent += author.name;
    }
  });
}
