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

// Get list of books
function getBookList(subject) {
  axios
    .get(`https://openlibrary.org/subjects/${subject}.json`)
    .then(function (response) {
      // Iterate through array of works with that subject and create book items
      for (let i = response.data.works.length - 1; i >= 0; i--) {
        createBookItem(response, i);
      }

      // If there are no books related to that subject show error message
      if (response.data.work_count == 0) {
        emptySubjMsg("noSubj");
      }
    })
    .catch(function () {
      // Show error message
      emptySubjMsg("emptySubj");
    });
}

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

function createBookItem(resp, num) {
  // Create single book item for all books
  const bookItem = document.createElement("div");
  bookItem.classList.add("bookItem");

  form.after(bookItem);

  // Book title element
  const titleEl = document.createElement("span");
  titleEl.classList.add("title");

  titleEl.textContent = resp.data.works[num].title;

  bookItem.append(titleEl);

  // Book author element
  const authorEl = document.createElement("span");
  authorEl.classList.add("author");

  addAuthors(resp, num, authorEl);

  bookItem.append(authorEl);

  // Arrow element to expand book item
  const arrow = document.createElement("i");
  arrow.classList.add("fa-solid", "fa-angle-down", "arrow");
  arrow.setAttribute("title", "Expand");

  bookItem.append(arrow);

  // Book cover ID
  const coverId = resp.data.works[num].cover_id;

  // Get book description
  getDescr(resp, num, coverId, bookItem, titleEl, authorEl, arrow);

  // Delete book items when the user clicks on search again
  searchBtn.addEventListener("click", () => {
    bookItem.remove();
  });
}

// Format author element
function addAuthors(resp, num, el) {
  el.textContent = "by ";

  // Check if author is listed
  if (resp.data.works[num].authors.length == 0) {
    el.textContent += "Unknown";
  }

  //Format author list
  resp.data.works[num].authors.forEach((author, index) => {
    // Check if there's more than one author
    if (resp.data.works[num].authors.length > 1) {
      // Add a comma after every author name except the last one
      if (resp.data.works[num].authors.length - 1 != index) {
        el.textContent += `${author.name}, `;
      } else {
        el.textContent += author.name;
      }
    } else {
      el.textContent += author.name;
    }
  });
}

// Get book description
function getDescr(resp, num, id, el, bookTitle, bookAuthor, clickEl) {
  axios
    .get(`https://openlibrary.org${resp.data.works[num].key}.json`)
    .then(function (response) {
      makeDescr(response, id, el, bookTitle, bookAuthor, clickEl);
    });
}

function makeDescr(resp, id, el, bookTitle, bookAuthor, clickEl) {
  // Description element
  const descriptionEl = document.createElement("div");
  descriptionEl.classList.add("description");

  el.append(descriptionEl);

  // Book cover
  const cover = document.createElement("div");
  cover.classList.add("cover");

  formatCover(cover, id, bookAuthor, bookTitle);

  descriptionEl.append(cover);

  //Book description
  const description = document.createElement("p");

  const descriptionText = formatDescr(resp);

  description.textContent = descriptionText;

  descriptionEl.append(description);

  // Expand and shrink book item decription
  expand(clickEl, descriptionEl);
}

function formatCover(cover, id, bookAuthor, bookTitle) {
  // Format authors to add in case there's no cover
  let author = bookAuthor.textContent;
  const index = author.indexOf(",", 55);
  if (index != -1) {
    author = author.slice(0, index);
    author += ", etc.";
  }

  //Check if cover image exists
  if (id == null || id == "") {
    cover.style.backgroundColor = "#f7f0f087";
    cover.innerHTML = `<span class="titleS">${bookTitle.textContent}</span>
                       <span class="authorS">${author}</span>`;
  } else {
    cover.style.backgroundImage = `url(https://covers.openlibrary.org/b/id/${id}-M.jpg)`;
  }
}

function formatDescr(resp) {
  let descriptionText;
  if (typeof resp.data.description == "string") {
    descriptionText = resp.data.description;
  } else if (typeof resp.data.description == "object") {
    descriptionText = resp.data.description.value;
  } else {
    descriptionText = "No description";
  }

  // Delete extra information
  const dashes = "----";
  const index = descriptionText.indexOf(dashes);
  if (index != -1) {
    descriptionText = descriptionText.slice(0, index);
  }

  return descriptionText;
}

// Expand and shrink book item decription when clicked
function expand(clickEl, descriptionEl) {
  clickEl.addEventListener("click", () => {
    if (!descriptionEl.classList.contains("show")) {
      descriptionEl.classList.add("show");
      clickEl.classList.remove("fa-angle-down");
      clickEl.classList.add("fa-angle-up");
    } else {
      descriptionEl.classList.remove("show");
      clickEl.classList.remove("fa-angle-up");
      clickEl.classList.add("fa-angle-down");
    }
  });
}
