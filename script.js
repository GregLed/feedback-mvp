const card = document.querySelector(".card");
const newReview = document.querySelector(".new-review");
const reviews = document.querySelector(".reviews");
const addReviewBtn = document.getElementById("add-btn");
const starPickers = document.querySelectorAll(".picker");
const submitReviewBtn = document.getElementById("submit-btn");
const userComment = document.getElementById("user-comment");
const totalRating = document.querySelector(".total-rating");

const lightGreyColor = "#bebebe";
const yellowColor = "#f8e825";

let data = [
  {
    rating: 4,
    comment: "book was full of fluff",
  },
  {
    rating: 3,
    comment: "book was fluff",
  },
  {
    rating: 4,
    comment: "book was amazing",
  },
];

// Check data in local storage
let reviewsData = JSON.parse(localStorage.getItem("reviews"));
if (reviewsData) {
  data = reviewsData;
}

createReviews(data);

let halfStar;
let halfStarCached;
let rating;
let ratingCached;

starPickers.forEach((star) => {
  star.addEventListener("mousemove", (e) => {
    // Get position within start element
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; //x position within the element.

    // If x position less than 10px, user selected half star rating
    if (x < 10) {
      halfStar = true;
    } else {
      halfStar = false;
    }

    rating = +star.id;

    removeColorStars();
    colorPreceedingStars(rating, halfStar);
  });

  // Remove stars coloring when leaving element
  star.addEventListener("mouseleave", () => {
    removeColorStars();

    if (ratingCached) {
      colorPreceedingStars(ratingCached, halfStarCached);
    }
  });

  // Cache rating by user
  star.addEventListener("click", () => {
    // If user clicked cached rating, we reset it
    if (halfStarCached === halfStar && ratingCached === rating) {
      halfStarCached = null;
      ratingCached = null;
      submitReviewBtn.disabled = true;
    } else {
      halfStarCached = halfStar;
      ratingCached = rating;
      submitReviewBtn.disabled = false;
    }
  });
});

addReviewBtn.addEventListener("click", () => {
  card.classList.remove("active");
  newReview.classList.add("active");
});

submitReviewBtn.addEventListener("click", () => {
  // Add user feedback to data array
  data.push({
    rating: halfStarCached ? ratingCached - 0.5 : ratingCached,
    comment: userComment.value,
  });

  localStorage.setItem("reviews", JSON.stringify(data));

  // Clear user inputs
  halfStar = null;
  halfStarCached = null;
  rating = null;
  ratingCached = null;
  userComment.value = "";
  submitReviewBtn.disabled = true;
  removeColorStars();

  // Create new reviews and activate screen
  createReviews(data);

  newReview.classList.remove("active");
  card.classList.add("active");
});

function removeColorStars() {
  Array.from(starPickers).forEach((star) => {
    star.children[0].classList = "fas fa-star";
    star.children[0].style.color = lightGreyColor;
  });
}

function colorPreceedingStars(rate, halfStar) {
  Array.from(starPickers)
    .slice(0, rate)
    .forEach((star, idx) => {
      if (idx === rate - 1 && halfStar) {
        star.children[0].classList = "fas fa-star-half-alt";
        star.children[0].style.color = yellowColor;
      } else {
        star.children[0].style.color = yellowColor;
      }
    });
}

function createReviews(data) {
  // Create a list of reviews
  reviews.innerHTML = "<h3>Reviews</h3>";

  data.forEach((review) => {
    const reviewEl = document.createElement("div");
    const commentEl = document.createElement("div");

    reviewEl.classList.add("review");
    commentEl.classList.add("comment");

    commentEl.innerHTML = `<strong>${review.rating}</strong>, ${review.comment}`;

    reviewEl.appendChild(createStars(review.rating));
    reviewEl.appendChild(commentEl);

    reviews.appendChild(reviewEl);
  });

  // Calculate and update average
  let average =
    data.reduce((acc, cur) => {
      return acc + cur.rating;
    }, 0) / data.length;

  // One decimal place only (no zeros)
  average = average.toFixed(1).replace(/[.,]0$/, "");

  totalRating.innerHTML = "";

  const numRating = document.createElement("div");
  numRating.classList.add("num-rating");
  numRating.innerHTML = average;

  totalRating.appendChild(numRating);
  totalRating.appendChild(createStars(average));
}

function createStars(score) {
  const starsEl = document.createElement("div");
  starsEl.classList.add("stars");

  starsEl.appendChild(createStar(score, 1));
  starsEl.appendChild(createStar(score, 2));
  starsEl.appendChild(createStar(score, 3));
  starsEl.appendChild(createStar(score, 4));
  starsEl.appendChild(createStar(score, 5));

  return starsEl;
}

function createStar(score, threshold) {
  const iEl = document.createElement("i");

  iEl.style.color = score >= threshold - 0.5 ? yellowColor : lightGreyColor;

  const className =
    score >= threshold
      ? "fa-star"
      : score >= threshold - 0.5
      ? "fa-star-half-alt"
      : "fa-star";

  iEl.classList.add("fas");
  iEl.classList.add(className);

  // Wrap in span element
  const spanEl = document.createElement("span");

  return spanEl.appendChild(iEl);
}
