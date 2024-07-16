//FETCH API
// Fetch API Request
//returned data has an object with a docs array
// function fetchBooks (){
// const url = 'http://localhost:3000/books';

// fetch(url)
//   .then(res => res.json())
//   .then(data => {
//     console.log(data);
//      const books = data.slice(0, 10);
//      displayBooks(books); 
//   })
//   .catch(error => {
//     console.log("Error fetching books:", error);
//   });
// }

document.addEventListener('DOMContentLoaded', () => {
  const aboutLink = document.getElementById('about-link');
  const aboutSection = document.getElementById('about');
  const homeLink = document.getElementById('home-link');
  const homeSection = document.getElementById('home');
  const suggestionsLink = document.getElementById('suggestions-link');
  const suggestionsSection = document.getElementById('suggestions');

//this is a container for the fetched books
function displayBooks(books){
const bookDisplay = document.getElementById('book-display');
bookDisplay.innerHTML = '';

books.forEach(book => {
const bookCard = document.createElement('div'); //creates a new div for each book
bookCard.classList.add('book');//for css styling
//content for each bookCard: img,title,author name
//unknown rep when author name is unknown
//@ div is appended to the div container of book collection
bookCard.innerHTML = `
  <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg" alt="${book.title}">
  <div class="book-details">
    <h3>${book.title}</h3>
    <p>by ${book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
  </div>
`;
bookDisplay.appendChild(bookCard);
})
}

//fetches data from API
function fetchBooks(searchQuery){
  fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}`) 
  .then(res => res.json())
  .then(data => {
    const books = data.docs
    displayBooks(books)
  })
  .catch(error=> console.error('Error fetching books:', error))
}

//submit event
const searchForm = document.getElementById('search-form')
const searchInput = document.getElementById('search-input')
searchForm.addEventListener('submit', (e)=>{
e.preventDefault()
const searchTerm = searchInput.value.trim()
fetchBooks(searchTerm)
searchInput.value = ''
})

//event listeners
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
 });

const searchTerm = searchInput.value.trim();
fetchBooks(searchTerm);
   
});

