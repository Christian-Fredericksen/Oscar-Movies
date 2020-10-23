const BASE_URL = "http://localhost:3000"
const MOVIES_URL = `${BASE_URL}/movies`
const USERS_URL = `${BASE_URL}/users`
const REVIEWS_URL = `${BASE_URL}/reviews`
const movieCollection = document.querySelector('#movie-collection')
const reviewsCollection = document.querySelector('#reviews-collection')
const likeButton = document.querySelector('.like-btn')
const signupForm = document.querySelector('#signup-form')
const signupInputs = document.querySelectorAll(".signup-input")
const header = document.querySelector('.header-banner')
const logout = document.querySelector('.logout')
let currentUser

class Movie {
    constructor(movieAttributes) {
        this.id = movieAttributes.id;
        this.title = movieAttributes.title;
        this.year = movieAttributes.year;
        this.starring = movieAttributes.starring;
        this.tag_line = movieAttributes.tag_line;
        this.link = movieAttributes.link;
        this.image = movieAttributes.image;
    }

    render() {
        return `<div class="card">
                  <h2>${this.title} (${this.year})</h2>
                  <h3>${this.starring}</h3>
                  <h4 class="tag-line">NOT SURE ABOUT THIS</h4> 
                  <a href=${this.link} target="_blank"><img src=${this.image} class="game-image" /></a>
                  <p>${this.tag_line}<p>
                  <button data-movie-id=${this.id} class="like-btn">♡</button>
                </div>`
    }
}

function putMoviesOnDom(movieArray){
    movieCollection.innerHTML = `<h2 class="subheader">Every Best Picture Winner Since the Year 2000</h2>
                                <h4 class="reviews-link">View My Reviews ♡</h4>`
                            
    movieArray.forEach(movie => {
        movieCollection.innerHTML += new Movie(movie).render()
    })
}




function putReviewsOnDom(reviewsArray){
    reviewsCollection.innerHTML = `<h2 class="subheader">My Reviews (sort of)</h2>
                               <h4 class="back-link">←Back to Movies</h4>`
    reviewsArray.forEach(review => {
        reviewsCollection.innerHTML += `<div class="card">
          <h2>${review.movie.title} (${review.movie.year})</h2>
          <h3>${review.movie.starring}</h3>
          <h4 class="tag-line">NOT SURE ABOUT THIS</h4>
          <a href=${review.movie.link} target="_blank"><img src=${review.movie.image} class="movie-image" /></a>
          <p>${review.movie.tag_line}<p>
          <button data-movie-id=${review.movie.id} class="like-btn" style="color:red;">♡</button>
        </div>`
    })
} 
     


function fetchMovies(){
    fetch(MOVIES_URL)
    .then(res => res.json())
    .then(movies => putMoviesOnDom(movies))
}

function fetchReviews(){
    fetch(BASE_URL + '/users/' + currentUser.id + '/reviews')
    .then(res => res.json())
    .then(reviews => putReviewsOnDom(reviews))
}

signupForm.addEventListener('submit', function(e){
    e.preventDefault()
    fetch(USERS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            user: {
                email: signupInputs[0].value,
                password: signupInputs[1].value
            }
        })
    })
    .then(res => res.json())
    .then(function(object){
        if (object.message) {
            alert(object.message)
        }
        else {
        loggedInUser(object)
        }
    }
    )
})

movieCollection.addEventListener('click', function(e) {
    if (e.target.className == "reviews-link") {
        movieCollection.style.display = 'none';
        fetchReviews();
        reviewsCollection.style.display = 'initial';
    }
})
 

reviewsCollection.addEventListener('click', function(e) {
    if (e.target.className == "back-link") {
        reviewsCollection.style.display = 'none';
        movieCollection.style.display = 'initial';
    }
})

logout.addEventListener('click', function(e) {
 if (e.target.className == "logout") {
     movieCollection.style.display = 'none';
     welcome.style.display = 'none';
     signupForm.style.display = 'initial';
 }
})

function loggedInUser(object){
    currentUser = object
    signupForm.style.display = 'none'
    welcome.innerHTML = `<h3>Hello, <i>${currentUser.email}</i>!</h3>`
    logout.innerText = "Logout"
    fetchMovies()
}






movieCollection.addEventListener('click', function(e){
    // console.log(event.target.className, event.target.style.color)
    // e.preventDefault() was preventing images from being clickable
    if ((e.target.className == "like-btn") && (e.target.style.color !== 'red')) {
        let target = e.target
            fetch(REVIEWS_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                        user_id: `${currentUser.id}`,
                        movie_id: `${e.target.dataset.movieId}`
                })
        })
        .then( res => res.json())
        .then( res => target.dataset.reviewId = res.id);
        e.target.style.color = 'red';}
    else if ((e.target.className == "like-btn") && (e.target.style.color == 'red')) {
        e.target.style.color = 'black';
        fetch(REVIEWS_URL + '/' + e.target.dataset.reviewId, {
            method: "DELETE"
        })
    }
})