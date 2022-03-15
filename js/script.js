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
    emptySubjMsg();
    return;
  }

  // Get list of books related to that subject
  getBookList(subject);
});

// Get list of books for subject in input
function getBookList(subject) {
  axios
    .get(`https://openlibrary.org/subjects/${subject}.json`)
    .then(function (response) {
      // Iterate through array of works with that subject and create book items
      for (let i = response.data.works.length - 1; i >= 0; i--) {
        createBookItem(response, i);
      }

      if (response.data.work_count == 0) {
        noSubjMsg();
      }
    })
    .catch(function () {
      // handle error
      emptySubjMsg();
    });
}

// Create error message if subject doesn't exist
function noSubjMsg() {
  // Make message appear only once
  if (document.querySelector(`.no-subj-msg`)) {
    return;
  }

  // Make message appear
  const noSubj = document.createElement("div");
  noSubj.classList.add("no-subj-msg");
  noSubj.textContent = "Sorry, there are no books related to this subject.";
  form.after(noSubj);

  // When user types in the input, make message disappear
  searchInput.addEventListener("input", function () {
    noSubj.remove();
  });
}

// Create error message if input is empty
function emptySubjMsg() {
  // Make message appear only once
  if (document.querySelector(".no-subj-msg")) {
    return;
  }

  // Make message appear
  const emptySubj = document.createElement("div");
  emptySubj.classList.add("no-subj-msg");
  emptySubj.textContent = "Please, type a subject to find books.";
  form.after(emptySubj);

  // When user types in the input, make message disappear
  searchInput.addEventListener("input", function () {
    emptySubj.remove();
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

  bookItem.append(titleEl);

  titleEl.textContent = resp.data.works[num].title;

  // Book author element
  const authorEl = document.createElement("span");
  authorEl.classList.add("author");

  bookItem.append(authorEl);

  addAuthors(resp, num, authorEl);

  // Arrow element to expand book item
  const arrow = document.createElement("i");
  arrow.classList.add("fa-solid", "fa-angle-down", "arrow");
  arrow.setAttribute("title", "Expand");

  bookItem.append(arrow);

  // Book cover ID
  const coverId = resp.data.works[num].cover_id;

  // Get book description
  getDescr(resp, num, coverId, bookItem, arrow);

  // Delete book items when the user clicks on search again
  searchBtn.addEventListener("click", () => {
    bookItem.remove();
  });
}

// Format author element
function addAuthors(resp, num, el) {
  el.textContent = "by ";
  resp.data.works[num].authors.forEach((author, index) => {
    // Check if there are more than one authors
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
function getDescr(resp, num, id, el, clickEl) {
  axios
    .get(`https://openlibrary.org${resp.data.works[num].key}.json`)
    .then(function (response) {
      makeDescr(response, id, el, clickEl);
    });
}

function makeDescr(resp, id, el, clickEl) {
  // Description element
  const descriptionEl = document.createElement("div");
  descriptionEl.classList.add("description");

  el.append(descriptionEl);

  // Book cover
  const cover = document.createElement("div");
  cover.classList.add("cover");

  // Check if cover image exists
  if (id == null || id == "") {
    cover.textContent = "No cover";
  } else {
    cover.style.backgroundImage = `url(https://covers.openlibrary.org/b/id/${id}-M.jpg)`;
  }

  descriptionEl.append(cover);

  //Book description
  const description = document.createElement("p");

  let descriptionText;
  if (typeof resp.data.description == "string") {
    descriptionText = resp.data.description;
  } else if (typeof resp.data.description == "object") {
    descriptionText = resp.data.description.value;
  } else {
    descriptionText = "No description";
  }

  // Format description text
  const searchItem = "----";
  const index = descriptionText.indexOf(searchItem);
  if (index != -1) {
    descriptionText = descriptionText.slice(0, index);
  }
  description.textContent = descriptionText;

  descriptionEl.append(description);

  // expand and shrink book item decription
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
