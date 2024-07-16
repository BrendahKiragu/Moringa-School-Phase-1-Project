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

  if (aboutLink && aboutSection) {
    console.log('Elements found');
    aboutLink.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('About link clicked');
      aboutSection.classList.toggle('hidden');
    });
  }
  if (homeLink && homeSection) {
    homeLink.addEventListener('click', (event) => {
      event.preventDefault();
      homeSection.classList.toggle('hidden');
    });
  }
});