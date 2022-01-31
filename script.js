const card = document.querySelector(".card");
const newReview = document.querySelector(".new-review");
const reviews = document.querySelector(".reviews");
const addReviewBtn = document.getElementById("add-btn");
const starPickers = document.querySelectorAll(".picker");
const submitReviewBtn = document.getElementById("submit-btn");
const userComment = document.getElementById("user-comment");
const totalRating = document.querySelector(".total-rating");

const lightGreyColor = "#bebebe";
const yellowColor = "#FFD700";

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
  starPickers.forEach((star) => {
    star.innerHTML = "";

    const iEl = document.createElement("i");
    iEl.classList.add("fas");
    iEl.classList.add("fa-star");
    iEl.style.color = lightGreyColor;

    star.appendChild(iEl);
  });
}

function colorPreceedingStars(rate, halfStar) {
  starPickers.forEach((star, idx) => {
    if (idx >= rate) return;

    star.innerHTML = "";

    const iEl = document.createElement("i");
    iEl.classList.add("fas");

    // Create half gold star
    if (idx === rate - 1 && halfStar) {
      const iEl2 = document.createElement("i");
      iEl2.classList.add("fas");

      iEl.style.color = yellowColor;
      iEl.classList.add("fa-star-half");
      iEl.classList.add("halfstar");

      iEl2.style.color = lightGreyColor;
      iEl2.classList.add("fa-star");
      iEl2.classList.add("background-star");

      star.appendChild(iEl);
      star.appendChild(iEl2);
    }
    // Create full gold star
    else {
      iEl.style.color = yellowColor;
      iEl.classList.add("fa-star");
      star.appendChild(iEl);
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
  // Wrap in span element
  const spanEl = document.createElement("span");

  const iEl = document.createElement("i");

  iEl.classList.add("fas");

  // Full gold star
  if (score >= threshold) {
    iEl.style.color = yellowColor;
    iEl.classList.add("fa-star");
    spanEl.appendChild(iEl);
  }
  // Half gold star
  else if (score >= threshold - 0.5) {
    const iEl2 = document.createElement("i");
    iEl2.classList.add("fas");

    iEl.style.color = yellowColor;
    iEl.classList.add("fa-star-half");
    iEl.classList.add("halfstar");

    iEl2.style.color = lightGreyColor;
    iEl2.classList.add("fa-star");
    iEl2.classList.add("background-star");

    spanEl.appendChild(iEl);
    spanEl.appendChild(iEl2);
  }
  // Grey star
  else {
    iEl.style.color = lightGreyColor;
    iEl.classList.add("fa-star");
    spanEl.appendChild(iEl);
  }

  return spanEl;
}
