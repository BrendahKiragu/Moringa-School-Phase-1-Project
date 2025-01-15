document.addEventListener("DOMContentLoaded", () => {
  const aboutSection = document.getElementById("about");
  const homeSection = document.getElementById("home");
  const suggestionsSection = document.getElementById("suggestions");
  const loadingIndicator = document.getElementById("loading-indicator");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const bookDisplay = document.getElementById("book-display");

  function showLoadingIndicator() {
    loadingIndicator.classList.remove("hidden");
  }

  function hideLoadingIndicator() {
    loadingIndicator.classList.add("hidden");
  }

  const burgerMenu = document.querySelector(".burger-menu");
  const navLinks = document.getElementById("nav-links");

  burgerMenu.addEventListener("click", () => {
    navLinks.classList.toggle("show"); // Toggle the navigation menu on burger click
  });

  // Hide burger menu after link selection
  const navLinkItems = document.querySelectorAll("#nav-links .navlink");
  navLinkItems.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show"); // Hide the menu on link click
    });
  });

  function fetchBooks(searchTerm) {
    showLoadingIndicator();
    fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const books = data.docs;
        displayBooks(books, searchTerm);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        displayError(
          "An error occurred while fetching books. Please try again later."
        );
      })
      .finally(() => {
        hideLoadingIndicator();
      });
  }

  function displayError(message) {
    const errorContainer = document.createElement("div");
    errorContainer.id = "error-container";
    errorContainer.classList.add("error");
    errorContainer.textContent = message;

    const retryButton = document.createElement("button");
    retryButton.textContent = "Retry";
    retryButton.addEventListener("click", () =>
      fetchBooks(searchInput.value.trim())
    );

    errorContainer.appendChild(retryButton);
    bookDisplay.appendChild(errorContainer);
  }

  function displayBooks(books, searchTerm) {
    bookDisplay.innerHTML = ""; // Reset previous content

    // Remove error message if it exists
    const errorContainer = document.getElementById("error-container");
    if (errorContainer) {
      errorContainer.remove();
    }

    let content = "";

    // Display search result message
    if (books.length === 0 && searchTerm) {
      content = `<p>Could not find any books for "${searchTerm}"</p>`;
    } else if (books.length > 0) {
      // Display book results
      content = `
        <p class="my-p">Displaying search results for "${searchTerm}"</p>
        ${books
          .map(
            (book) => `
          <div class="displayBookContainer">
            <img src="https://covers.openlibrary.org/b/id/${
              book.cover_i
            }-M.jpg" alt="${book.title}">
            <div class="book-details">
              <h3>Title: ${book.title}</h3>
              <p><strong>Author:</strong> ${
                book.author_name ? book.author_name.join(", ") : "Unknown"
              }</p>
              <p><strong>Subjects:</strong> ${
                book.subject_facet
                  ? book.subject_facet.slice(0, 3).join(", ")
                  : "Unknown"
              }</p>
              <p><strong>Number of Pages:</strong> ${
                book.number_of_pages_median || "Unknown"
              }</p>
              <a href="https://openlibrary.org${book.key}">View Details</a>
            </div>
          </div>`
          )
          .join("")}
      `;
    }

    bookDisplay.innerHTML = content; // Inject content into the bookDisplay container

    hideActiveSections(); // Hide other sections
    bookDisplay.classList.remove("hidden"); // Show the book display section
  }

  function hideActiveSections() {
    [aboutSection, homeSection, suggestionsSection].forEach((section) => {
      section.classList.add("hidden");
    });
    bookDisplay.classList.remove("hidden");
  }

  // Handle search form submission
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      fetchBooks(searchTerm);
      searchInput.value = "";
    }
  });

  const aboutLink = document.querySelector("#about");
  aboutLink.addEventListener("click", (event) => {
    event.preventDefault();
    hideActiveSections();
    aboutSection.classList.remove("hidden");
  });

  const suggestionsLink = document.querySelector("#suggestions");
  suggestionsLink.addEventListener("click", (event) => {
    event.preventDefault();
    hideActiveSections();
    suggestionsSection.classList.remove("hidden");
  });

  // Function to hide all sections
  function hideAllSections() {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => section.classList.add("hidden"));
  }
  // Function to show a specific section
  function showSection(id) {
    hideAllSections();
    const section = document.getElementById(id);
    if (section) {
      section.classList.remove("hidden");
    }
  }
  document.querySelectorAll(".navlink").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = e.target.getAttribute("href").substring(1); // Removes '#' from href attribute
      showSection(targetSection);
    });
  });

  function initializeApp() {
    hideActiveSections();
    homeSection.classList.remove("hidden");
  }

  initializeApp();
});
