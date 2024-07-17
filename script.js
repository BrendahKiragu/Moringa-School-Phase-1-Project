document.addEventListener('DOMContentLoaded', () => {
  const aboutLink = document.getElementById('about-link');
  const aboutSection = document.getElementById('about');
  const homeLink = document.getElementById('home-link');
  const homeSection = document.getElementById('home');
  const suggestionsLink = document.getElementById('suggestions-link');
  const suggestionsSection = document.getElementById('suggestions');

//function to display books
function displayBooks(books, searchTerm){
const bookDisplay = document.getElementById('book-display');
bookDisplay.innerHTML = '';

// Creates a heading element to display search results
const searchResultsText = document.createElement('h2');
searchResultsText.textContent = `Search results for "${searchTerm}"`;
bookDisplay.appendChild(searchResultsText);

books.forEach(book => {
const bookCard = document.createElement('div'); 
bookCard.classList.add('displayBookContainer')
bookCard.innerHTML = `
  <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="${book.title}">
  <div class="book-details">
    <h3>Title: ${book.title}</h3>
    <p><strong>Author:</strong> ${book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
    <p><strong>Subjects:</strong> ${book.subject_facet}</p>
    <a href="https://openlibrary.org${book.key}" >View Details</a>
   </div>
`;
bookDisplay.appendChild(bookCard);
})
}

//fetches books from open library book search API
function fetchBooks(searchTerm){
  fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}`) 
    .then(res => res.json())
    .then(data => {
      const books = data.docs
      displayBooks(books, searchTerm)
    })
    .catch(error=> {console.log('Error fetching books:', error)})
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

//Nav links event listeners
aboutLink.addEventListener('click', (event) => {
  event.preventDefault();
  aboutSection.classList.toggle('hidden');
});

homeLink.addEventListener('click', (event) => {
  event.preventDefault();
  homeSection.classList.toggle('hidden');
});

suggestionsLink.addEventListener('click', (event) => {
  event.preventDefault();
  suggestionsSection.classList.toggle('hidden')
  fetchSuggestions()
 });

//function to fetch suggested books from open library
function fetchSuggestions(){
  fetch('https://openlibrary.org/subjects/fiction.json?random=true&limit=3')
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
const searchTerm = searchInput.value.trim();
fetchBooks(searchTerm);
fetchSuggestions()
});

