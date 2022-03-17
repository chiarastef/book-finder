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

  // Expand and close book item decription
  expand(clickEl, descriptionEl);
}

function formatCover(cover, id, bookAuthor, bookTitle) {
  // Format authors to add in case there's no cover
  let author = bookAuthor.textContent;
  // In case authors list is too long to fit inside cover, make string shorted and add etc.
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
    cover.setAttribute("title", `Cover of ${bookTitle.textContent}`);
  }
}

function formatDescr(resp) {
  let descriptionText;
  if (typeof resp.data.description == "string") {
    descriptionText = resp.data.description;
  } else if (typeof resp.data.description == "object") {
    descriptionText = resp.data.description.value;
  } else {
    descriptionText = "";
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
      clickEl.innerHTML = `<span>Close</span> <i class="fa-solid fa-sort-up arrow-up"></i>`;
    } else {
      descriptionEl.classList.remove("show");
      clickEl.innerHTML = `<span>Expand</span> <i class="fa-solid fa-sort-down arrow-down"></i>`;
    }
  });
}
