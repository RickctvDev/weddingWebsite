document.addEventListener("DOMContentLoaded", function () {
    const photoContainer = document.getElementById("photoContainer");
    const modalImage = document.getElementById("modalImage");
    const photoModal = new bootstrap.Modal(document.getElementById("photoModal"), {
        keyboard: false
    });

    // Create an array of image paths for 163 images
    const images = [];
    for (let i = 1; i <= 163; i++) {
        const paddedNumber = String(i).padStart(3, '0'); // Ensure the number is 3 digits
        const imagePath = `src/assets/A&Rphoto${paddedNumber}.jpg`;
        images.push(imagePath);
    }

    // Create and append Bootstrap cards with images
    images.forEach((src, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.width = "18rem";
        card.innerHTML = `
            <img class="card-img-top" src="${src}" alt="Card ${index}">
        `;
        card.addEventListener("click", () => {
            modalImage.src = src;
            photoModal.show();
        });
        photoContainer.appendChild(card);
    });

    // Check if images are actually loading
    const allImages = document.querySelectorAll(".card-img-top");
    allImages.forEach(img => {
        img.addEventListener("error", () => {
            console.error(`Failed to load image: ${img.src}`);
        });
        img.addEventListener("load", () => {
            console.log(`Successfully loaded image: ${img.src}`);
        });
    });
});
