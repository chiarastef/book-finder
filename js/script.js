const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const form = document.querySelector("form");

// Search subject
searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  // Make input text always all lowercase
  let subject = searchInput.value.toLowerCase();
  searchInput.value = "";

  // Check if input is not empty
  if (subject == "") {
    emptySubjMsg();
    return;
  }

  // Get list of books related to that subject
  getBookList(subject);
});

// Create message if input is empty
function emptySubjMsg() {
  // Make message appear only once
  if (document.querySelector(".no-subj-msg")) {
    return;
  }

  // Make message appear
  const noSubj = document.createElement("div");
  noSubj.classList.add("no-subj-msg");
  noSubj.textContent = "Please, type a subject to find books.";
  form.after(noSubj);

  // When user types in the input, make message disappear
  searchInput.addEventListener("input", function () {
    noSubj.remove();
  });
}

// Get list of books for subject in input
function getBookList(subject) {
  axios
    .get(`https://openlibrary.org/subjects/${subject}.json`)
    .then(function (response) {
      // Iterate through array of works with that subject
      for (let i = response.data.works.length - 1; i >= 0; i--) {
        createBookItem(response, i);
      }
    });
}

function createBookItem(response, a) {
  // Create single book item for all books
  const bookItem = document.createElement("div");
  bookItem.classList.add("bookItem");
  bookItem.innerHTML = `<span class="title">${response.data.works[a].title}</span> 
                        <span class="author">by </span>
                        <i class="fa-solid fa-angle-down arrow" title="Expand"></i>`;
  // Add book item after search form
  form.after(bookItem);

  // Book author(s)
  const author = document.createElement("span");
  const authorContainer = document.querySelector(".author");
  for (let j = 0; j < response.data.works[a].authors.length; j++) {
    if (response.data.works[a].authors.length > 1) {
      if (j != response.data.works[a].authors.length - 1) {
        author.textContent += `${response.data.works[a].authors[j].name}, `;
      } else {
        author.textContent += response.data.works[a].authors[j].name;
      }
    } else {
      author.textContent = response.data.works[a].authors[j].name;
    }
    // Add author name(s) to author element
    authorContainer.append(author);
  }

  // Book cover
  const cover = document.createElement("div");
  cover.classList.add("cover");
  cover.style.backgroundImage = `url(https://covers.openlibrary.org/b/id/${response.data.works[a].cover_id}-M.jpg)`;

  // Book description
  const description = document.createElement("div");
  description.classList.add("description");
  // Get book description
  axios
    .get(`https://openlibrary.org${response.data.works[a].key}.json`)
    .then(function (response) {
      let descriptionText;
      if (typeof response.data.description == "string") {
        descriptionText = response.data.description;
      } else {
        descriptionText = response.data.description.value;
      }

      description.innerHTML += `<p>${descriptionText}</p>`;
    });

  // Add cover and description to document
  bookItem.append(cover);
  cover.after(description);

  // Show and hide cover and description of book
  const arrow = document.querySelector(".arrow");
  arrow.addEventListener("click", function () {
    if (
      !description.classList.contains("show") &&
      !cover.classList.contains("show")
    ) {
      description.classList.add("show");
      cover.classList.add("show");
      arrow.classList.remove("fa-angle-down");
      arrow.classList.add("fa-angle-up");
    } else {
      description.classList.remove("show");
      cover.classList.remove("show");
      arrow.classList.remove("fa-angle-up");
      arrow.classList.add("fa-angle-down");
    }
  });
}
