const card = document.querySelector(".card");
const newReview = document.querySelector(".new-review");
const reviews = document.querySelector(".reviews");
const addReviewBtn = document.getElementById("add-btn");
const starPickers = document.querySelectorAll(".picker");
const submitReviewBtn = document.getElementById("submit-btn");

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

let halfStar;
let halfStarCached;
let rating;
let ratingCached;

createReviews(data);

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

    // Covert to int
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
  data.forEach((review) => {
    const reviewElDOM = document.createElement("div");
    reviewElDOM.classList.add("review");

    reviewElDOM.innerHTML = `
        <div class="stars">
          <span>
            <i style="color: ${
              review.rating >= 1 ? yellowColor : lightGreyColor
            };" class='fas fa-star'></i>
          </span>
          <span>
            <i style="color: ${
              review.rating >= 2 ? yellowColor : lightGreyColor
            };" class='fas fa-star'></i>
          </span>
          <span>
            <i style="color: ${
              review.rating >= 3 ? yellowColor : lightGreyColor
            };" class='fas fa-star'></i>
          </span>
          <span>
            <i style="color: ${
              review.rating >= 4 ? yellowColor : lightGreyColor
            };" class='fas fa-star'></i>
          </span>
          <span>
            <i style="color: ${
              review.rating >= 5 ? yellowColor : lightGreyColor
            };" class='fas fa-star'></i>
          </span>
        </div>
        <div class="comment"><strong>${review.rating}</strong>, ${
      review.comment
    }</div>`;

    reviews.appendChild(reviewElDOM);
  });
}
