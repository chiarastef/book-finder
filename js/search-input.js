const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const form = document.querySelector("form");

// Search subject
searchBtn.addEventListener("click", function (event) {
  event.preventDefault();

  // Make input text always all lowercase
  let subject = searchInput.value.toLowerCase();

  // Empty input field after search
  searchInput.value = "";

  // Check if input is empty
  if (subject == "") {
    // Show error message
    emptySubjMsg("emptySubj");
    return;
  }

  // Get list of books related to that subject
  getBookList(subject);
});

// Create error message if input is empty or if there are no books related to subject
function emptySubjMsg(text) {
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

  // When user types in the search field, make message disappear
  searchInput.addEventListener("input", function () {
    text.remove();
  });
}
