const card = document.querySelector(".card");
const newReview = document.querySelector(".new-review");
const addReviewBtn = document.getElementById("add-btn");
const submitReviewBtn = document.getElementById("submit-btn");
const starPickers = document.querySelectorAll(".picker");

starPickers.forEach((star) => {
  star.addEventListener("mouseenter", (e) => {
    removeColorPreceedingStars();
    colorPreceedingStars(+star.id);
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

function removeColorPreceedingStars() {
  Array.from(starPickers).forEach((star) => {
    star.children[0].style.color = "#bebebe";
  });
}

function colorPreceedingStars(rate) {
  Array.from(starPickers)
    .slice(0, rate)
    .forEach((star) => {
      star.children[0].style.color = "#f8e825";
    });
}
