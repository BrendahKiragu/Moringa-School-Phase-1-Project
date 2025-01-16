document.addEventListener("DOMContentLoaded", () => {
  const loadingIndicator = document.getElementById("loading-indicator");
  const bookResultsSection = document.getElementById("book-results-section");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const bookDisplay = document.getElementById("book-display");

  // Show the loading indicator
  function showLoadingIndicator() {
    loadingIndicator.classList.remove("hidden");
    bookResultsSection.classList.add("hidden");
  }

  // Hide the loading indicator
  function hideLoadingIndicator() {
    loadingIndicator.classList.add("hidden");
    bookResultsSection.classList.remove("hidden");
  }

  // Fetch books based on search term
  function fetchBooks(searchTerm) {
    if (!searchTerm) return;

    showLoadingIndicator();
    fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}`
    )
      .then((res) => res.json())
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

  // Display books from search result
  function displayBooks(books, searchTerm) {
    if (books.length === 0) {
      displayError(
        `No results found for "${searchTerm}". Please try another search.`
      );
      return;
    }

    bookDisplay.innerHTML = books
      .map(
        (book) => ` 
          <div class="book-card">
            <img src="https://covers.openlibrary.org/b/id/${
              book.cover_i
            }-M.jpg" alt="${book.title}">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${
              book.author_name ? book.author_name.join(", ") : "Unknown"
            }</p>
            <p><strong>Subjects:</strong> ${
              book.subject_facet
                ? book.subject_facet.slice(0, 3).join(", ")
                : "Unknown"
            }</p>
            <p><strong>Pages:</strong> ${
              book.number_of_pages_median || "Unknown"
            }</p>
            <a href="https://openlibrary.org${
              book.key
            }" target="_blank">View Details</a>
          </div>`
      )
      .join("");
  }

  // Display error message when no results are found
  function displayError(message) {
    bookDisplay.innerHTML = `<p class="error-message">${message}</p>`;
  }

  // Handle search form submission
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      fetchBooks(searchTerm);
      document.querySelector(".search-form").classList.add("hidden");
      bookResultsSection.classList.remove("hidden");
    }
  });

  // Burger menu toggle functionality
  const burgerMenu = document.querySelector(".burger-menu");
  const navLinks = document.getElementById("nav-links");

  burgerMenu.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});
