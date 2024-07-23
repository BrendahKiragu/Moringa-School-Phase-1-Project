document.addEventListener('DOMContentLoaded', () => {
  const aboutLink = document.getElementById('about-link');
  const aboutSection = document.getElementById('about');
  const homeLink = document.getElementById('home-link');
  const homeSection = document.getElementById('home');
  const suggestionsLink = document.getElementById('suggestions-link');
  const suggestionsSection = document.getElementById('suggestions');
  const loadingIndicator = document.getElementById('loading-indicator');

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

//fetches books from open library book search API
function fetchBooks(searchTerm){
  showLoadingIndicator();

  fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}`) 
    .then(res => res.json())
    .then(data => {
      const books = data.docs
      displayBooks(books, searchTerm)
    })
    .catch(error=> {console.log('Error fetching books:', error)
    displayError('An error occurred while fetching books. Please try again later.');
    })
   .finally(() => {
        hideLoadingIndicator();
    }); 
}

  // Function to display error messages
function displayError(message) {
    const errorContainer = document.createElement('div');
    errorContainer.id = 'error-container';
    errorContainer.classList.add('error');
    errorContainer.textContent = message;
    document.appendChild(errorContainer);
}

//function to display books
function displayBooks(books, searchTerm){
const bookDisplay = document.getElementById('book-display');
bookDisplay.innerHTML = '';

// Clear previous error messages
const errorContainer = document.getElementById('error-container');
if (errorContainer) {
  errorContainer.remove();
}

// Creates a heading element to display search results
const searchResultsText = document.createElement('p');
searchResultsText.textContent = `Showing Search results for " ${searchTerm} "`;
bookDisplay.appendChild(searchResultsText);

books.forEach(book => {
const bookCard = document.createElement('div'); 
bookCard.classList.add('displayBookContainer')
bookCard.innerHTML = `
  <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="${book.title}">
  <div class="book-details">
    <h3>Title: ${book.title}</h3>
    <p><strong>Author:</strong> ${book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
    <p><strong>Subjects:</strong> ${book.subject_facet ? book.subject_facet.join(', ') : 'Unknown'}</p>
    <p><strong>Number of Pages:</strong> ${book.number_of_pages_median ? book.number_of_pages_median : 'Unknown'}</p>
    <a href="https://openlibrary.org${book.key}" >View Details</a>
   </div>
`;
bookDisplay.appendChild(bookCard);
})
}

//search form event listener
const searchForm = document.getElementById('search-form')
const searchInput = document.getElementById('search-input')
searchForm.addEventListener('submit', (e)=>{
  e.preventDefault()
  const searchTerm = searchInput.value.trim()
  fetchBooks(searchTerm)
  searchInput.value = ''
})

//hide a section when another section is clicked
function toggleSections(sectionToShow, sectionsToHide){
  Object.values(sectionsToHide).forEach(section =>{
    section.classList.add('hidden')
  })
  sectionToShow.classList.remove('hidden')
}

//Nav links event listeners
aboutLink.addEventListener('click', (event) => {
  event.preventDefault();
  toggleSections(aboutSection, {homeSection, suggestionsSection});
});

homeLink.addEventListener('click', (event) => {
  event.preventDefault();
  toggleSections(homeSection, {aboutSection, suggestionsSection});
});

suggestionsLink.addEventListener('click', (event) => {
  event.preventDefault();
  toggleSections(suggestionsSection, {homeSection, aboutSection});
  fetchSuggestions()
 });

//function to fetch suggested books from open library
function fetchSuggestions(){
  fetch('https://openlibrary.org/subjects/fiction.json?limit=5')
  .then(res=> res.json())
  .then(data => {
    displaySuggestions(data.works)
  })
  .catch(error=>{console.log('Error:', error)})
}


//function to display suggested books
function displaySuggestions(books){
  const suggestionsContainer= document.getElementById('suggestions-list')
  suggestionsContainer.innerHTML=""

  books.forEach(book=>{
    const suggestedBook = document.createElement('div')
    suggestedBook.classList.add('displayBookContainer')
    suggestedBook.innerHTML =`
      <img src="https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg" alt="${book.title}">
      <h3>Title: ${book.title}</h3>
      <p><strong>Author:</strong> ${book.authors.map(author => author.name)}</p>
      <a href="https://openlibrary.org${book.key}" >View Details</a>
      `
    suggestionsContainer.appendChild(suggestedBook)
  })
}

const initialSearchTerm = searchInput.value.trim();
fetchBooks(initialSearchTerm);
fetchSuggestions()
});

