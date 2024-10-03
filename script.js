document.addEventListener("DOMContentLoaded", () => {
  const aboutLink = document.getElementById("about-link");
  const aboutSection = document.getElementById("about");
  const homeLink = document.getElementById("home-link");
  const homeSection = document.getElementById("home");
  const suggestionsLink = document.getElementById("suggestions-link");
  const suggestionsSection = document.getElementById("suggestions");
  const loadingIndicator = document.getElementById("loading-indicator");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const bookDisplay = document.getElementById("book-display");
  const goBackButton = document.getElementById("go-back-button");
  const readMoreLink = document.querySelector('a[href="#about-link"]'); // Select the specific anchor

  function showLoadingIndicator() {
    loadingIndicator.classList.remove("hidden");
  }

  function hideLoadingIndicator() {
    loadingIndicator.classList.add("hidden");
  }

  const burgerMenu = document.querySelector(".burger-menu");
  const navLinks = document.getElementById("nav-links");

  burgerMenu.addEventListener("click", () => {
    navLinks.classList.toggle("show");
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
    goBackButton.classList.add("hidden"); // Hide the go back button in case of error
  }

  function displayBooks(books, searchTerm) {
    bookDisplay.innerHTML = "";

    const errorContainer = document.getElementById("error-container");
    if (errorContainer) {
      errorContainer.remove();
    }

    let content = "";

    if (books.length === 0 && searchTerm) {
      content = `<p>Could not find any books for "${searchTerm}"</p>`;
      goBackButton.classList.add("hidden"); // Hide button if no results
    } else if (books.length > 0) {
      content = books
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
        </div>
      `
        )
        .join("");
      goBackButton.classList.remove("hidden"); // Show button if there are results
    }

    bookDisplay.innerHTML = content;

    hideActiveSections();
    bookDisplay.classList.remove("hidden");
  }

  function hideActiveSections() {
    [aboutSection, homeSection, suggestionsSection].forEach((section) => {
      section.classList.add("hidden");
    });
    bookDisplay.classList.remove("hidden");
  }

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      fetchBooks(searchTerm);
      searchInput.value = "";
    }
  });

  aboutLink.addEventListener("click", (event) => {
    event.preventDefault();
    hideActiveSections();
    aboutSection.classList.remove("hidden");
    goBackButton.classList.add("hidden"); // Hide button when switching sections
  });

  readMoreLink.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    hideActiveSections(); // Hide other sections
    aboutSection.classList.remove("hidden"); // Show About section
    goBackButton.classList.add("hidden"); // Hide go back button
  });

  homeLink.addEventListener("click", (event) => {
    event.preventDefault();
    hideActiveSections();
    homeSection.classList.remove("hidden");
    goBackButton.classList.add("hidden"); // Hide button when switching sections
  });

  suggestionsLink.addEventListener("click", (event) => {
    event.preventDefault();
    hideActiveSections();
    suggestionsSection.classList.remove("hidden");
    goBackButton.classList.add("hidden"); // Hide button when switching sections
  });

  // Add event listener to the go back button
  goBackButton.addEventListener("click", goBack);

  function goBack() {
    hideActiveSections();
    homeSection.classList.remove("hidden");
    bookDisplay.innerHTML = ""; // Clear the search results
    searchInput.value = ""; // Clear the search input
    goBackButton.classList.add("hidden"); // Hide the button
  }

  function initializeApp() {
    hideActiveSections(); // Hide all sections
    homeSection.classList.remove("hidden"); // Show home section initially
    goBackButton.classList.add("hidden"); // Hide go back button on load
  }

  // function fetchSuggestions() {
  // Implement logic to fetch and display suggestions if needed.
  //   suggestionsSection.classList.remove("hidden");
  //   goBackButton.classList.add("hidden"); // Hide button when showing suggestions
  // }

  initializeApp();
});
