//FETCH API
// Fetch API Request
//returned data has an object with a docs array
function fetchBooks (){
const url = 'https://openlibrary.org/search.json?q=${query}';

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log(data);
    // const books = data.slice(0, 10);
    // displayBooks(books); 
  })
  .catch(error => {
    console.log("Error fetching books:", error);
  });
}
