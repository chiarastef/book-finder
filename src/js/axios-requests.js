import axios from "axios";

import { emptySubjMsg, loader } from "./search-input.js";
import { showSearched, createBookItem } from "./book-items.js";
import { makeDescr } from "./expanded-book-items.js";

//Get list of books
export function getBookList(subject) {
  axios
    .get(`https://openlibrary.org/subjects/${subject}.json`)
    .then(function (response) {
      // Make loader disappear
      loader.classList.remove("show");

      // If there are no books related to that subject show error message
      if (response.data.work_count == 0) {
        emptySubjMsg("noSubj");
        return;
      }

      // Show subject searched
      showSearched(subject);

      // Iterate through array of works with that subject and create book items
      // In order to follow the books order of the json file, the book items are created and inserted in reverse order
      for (let i = response.data.works.length - 1; i >= 0; i--) {
        createBookItem(response, i);
      }
    })
    .catch(function () {
      // Show error message
      emptySubjMsg("emptySubj");
    });
}

// Get book description
export function getDescr(resp, num, id, el, bookTitle, bookAuthor, clickEl) {
  axios
    .get(`https://openlibrary.org${resp.data.works[num].key}.json`)
    .then(function (response) {
      makeDescr(response, id, el, bookTitle, bookAuthor, clickEl);
    });
}
