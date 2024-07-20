let slideIndex = 1;
showSlide(slideIndex);

function changeSlide(n) {
    showSlide(slideIndex += n);
}

function showSlide(n) {
    let slides = document.getElementsByClassName("slide");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";
}

function initializeSlideshow() {
    showSlide(slideIndex);
    setInterval(() => changeSlide(1), 2000); // Change slide every 2 seconds
}

// Run this when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSlideshow();
});

