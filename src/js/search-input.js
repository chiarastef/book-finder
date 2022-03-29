import { getBookList } from "./axios-requests.js";

const searchInput = document.querySelector("#searchInput");
export const loader = document.querySelector(".loader");
export const form = document.querySelector("form");

// Handle input provided by user
export function handleInput(e) {
  e.preventDefault();

  // Make loader appear
  loader.classList.add("show");

  // Make input text always all lowercase
  const subject = searchInput.value.toLowerCase();

  // Check if input is empty
  if (subject == "") {
    // Show error message
    emptySubjMsg("emptySubj");
    return;
  }

  // Empty input field after search
  searchInput.value = "";

  // Get list of books related to that subject
  getBookList(subject);
}

// Create error message if input is empty or if there are no books related to subject
export function emptySubjMsg(text) {
  // Make loader disappear
  loader.classList.remove("show");

  // Make message appear only once
  if (document.querySelector(".no-subj-msg")) {
    return;
  }

  // Check if the error was the empty input or not
  let isEmpty;
  if (text == "emptySubj") {
    isEmpty = true;
  }

  // Make message appear
  text = document.createElement("div");
  text.classList.add("no-subj-msg");
  // Change message based on the error type
  if (isEmpty == true) {
    text.textContent = "Please, type a subject to find books.";
  } else {
    text.textContent = "Sorry, there are no books related to this subject.";
  }
  form.after(text);

  // When user types again in the search field, make message disappear
  searchInput.addEventListener("input", function () {
    text.remove();
  });
}
