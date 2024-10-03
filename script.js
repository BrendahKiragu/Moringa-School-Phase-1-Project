document.addEventListener('DOMContentLoaded', () => {
  const aboutLink = document.getElementById('about-link');
  const aboutSection = document.getElementById('about');
  const homeLink = document.getElementById('home-link');
  const homeSection = document.getElementById('home');
  const suggestionsLink = document.getElementById('suggestions-link');
  const suggestionsSection = document.getElementById('suggestions');
  const loadingIndicator = document.getElementById('loading-indicator');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const bookDisplay = document.getElementById('book-display');

  function showLoadingIndicator() {
    loadingIndicator.classList.remove('hidden');
  }

  function hideLoadingIndicator() {
    loadingIndicator.classList.add('hidden');
  }

  const burgerMenu = document.querySelector('.burger-menu');
  const navLinks = document.getElementById('nav-links');

  burgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  function fetchBooks(searchTerm) {
    showLoadingIndicator();

    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}`)
      .then(res => res.json())
      .then(data => {
        const books = data.docs;
        displayBooks(books, searchTerm);
      })
      .catch(error => {
        console.log('Error fetching books:', error);
        displayError('An error occurred while fetching books. Please try again later.');
      })
      .finally(() => {
        hideLoadingIndicator();
      });
  }

  function displayError(message) {
    const errorContainer = document.createElement('div');
    errorContainer.id = 'error-container';
    errorContainer.classList.add('error');
    errorContainer.textContent = message;

    const retryButton = document.createElement('button');
    retryButton.textContent = 'Retry';
    retryButton.addEventListener('click', () => fetchBooks(searchInput.value.trim()));

    errorContainer.appendChild(retryButton);
    bookDisplay.appendChild(errorContainer);
  }

  function displayBooks(books, searchTerm) {
    bookDisplay.innerHTML = '';

    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
      errorContainer.remove();
    }

    let content = '';

    if (books.length === 0 && searchTerm) {
      content = `<p>Could not find any books for "${searchTerm}"</p>`;
    } else if (books.length > 0) {
      books.forEach(book => {
        content += `
          <div class="displayBookContainer">
            <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="${book.title}">
            <div class="book-details">
              <h3>Title: ${book.title}</h3>
              <p><strong>Author:</strong> ${book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
              <p><strong>Subjects:</strong> ${book.subject_facet ? book.subject_facet.slice(0, 3).join(', ') : 'Unknown'}</p>
              <p><strong>Number of Pages:</strong> ${book.number_of_pages_median ? book.number_of_pages_median : 'Unknown'}</p>
              <a href="https://openlibrary.org${book.key}">View Details</a>
            </div>
          </div>`;
      });
    }

    bookDisplay.innerHTML = content;

    // Hide the currently active section and show book display
    hideActiveSection();
    bookDisplay.classList.remove('hidden');
  }

  function hideActiveSection() {
    [aboutSection, homeSection, suggestionsSection].forEach(section => {
      section.classList.add('hidden');
    });
    bookDisplay.classList.remove('hidden'); // Ensure book display is visible
  }

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      fetchBooks(searchTerm);
      searchInput.value = '';
    }
  });

  aboutLink.addEventListener('click', (event) => {
    event.preventDefault();
    hideActiveSection();
    aboutSection.classList.remove('hidden');
  });

  homeLink.addEventListener('click', (event) => {
    event.preventDefault();
    hideActiveSection();
    homeSection.classList.remove('hidden');
  });

  suggestionsLink.addEventListener('click', (event) => {
    event.preventDefault();
    hideActiveSection();
    suggestionsSection.classList.remove('hidden');
  });

  function initializeApp() {
    fetchSuggestions();
  }

  initializeApp();
});
