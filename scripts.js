document.addEventListener("DOMContentLoaded", function () {
    const photoContainer = document.getElementById("photoContainer");
    const modalImage = document.getElementById("modalImage");
    const photoModal = new bootstrap.Modal(document.getElementById("photoModal"), {
        keyboard: false
    });
    const prevImageBtn = document.getElementById("prevImage");
    const nextImageBtn = document.getElementById("nextImage");
    const carouselThumbnails = document.getElementById("carouselThumbnails");
    let currentIndex = 0;

    const images = [];
    for (let i = 1; i <= 163; i++) {
        const paddedNumber = String(i).padStart(3, '0');
        const imagePath = `src/assets/A&Rphoto${paddedNumber}.jpg`;
        images.push(imagePath);
    }

    images.forEach((src, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.width = "18rem";
        card.innerHTML = `<img class="card-img-top" src="${src}" alt="Card ${index}">`;
        card.addEventListener("click", () => {
            showImage(index);
        });
        photoContainer.appendChild(card);
    });

    function showImage(index) {
        currentIndex = index;
        modalImage.src = images[currentIndex];
        photoModal.show();
        updateThumbnails();
        setTimeout(scrollToCurrentThumbnail, 300); // Ensure scroll happens after the modal is fully rendered
    }

    function updateThumbnails() {
        carouselThumbnails.innerHTML = '';
        images.forEach((src, index) => {
            const thumbnail = document.createElement("img");
            thumbnail.src = src;
            thumbnail.className = index === currentIndex ? 'active large-thumbnail' : '';
            thumbnail.addEventListener("click", () => showImage(index));
            carouselThumbnails.appendChild(thumbnail);
        });
    }

    function scrollToCurrentThumbnail() {
        const activeThumbnail = document.querySelector("#carouselThumbnails img.active");
        if (activeThumbnail) {
            const containerWidth = carouselThumbnails.clientWidth;
            const scrollLeft = activeThumbnail.offsetLeft + activeThumbnail.clientWidth / 2 - containerWidth / 2;
            console.log("Thumbnail Width: ", activeThumbnail.clientWidth);
            console.log("Container Width: ", containerWidth);
            console.log("Active Thumbnail Offset Left: ", activeThumbnail.offsetLeft);
            console.log("Scroll Position: ", scrollLeft);
            carouselThumbnails.scrollLeft = scrollLeft;
            console.log("After Scroll - Scroll Left: ", carouselThumbnails.scrollLeft);
        }
    }

    prevImageBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
        setTimeout(scrollToCurrentThumbnail, 300); // Ensure scroll happens after the modal is fully rendered
    });

    nextImageBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
        setTimeout(scrollToCurrentThumbnail, 300); // Ensure scroll happens after the modal is fully rendered
    });

    document.addEventListener("keydown", (event) => {
        if (photoModal._isShown) {
            if (event.key === "ArrowLeft") {
                prevImageBtn.click();
            } else if (event.key === "ArrowRight") {
                nextImageBtn.click();
            }
        }
    });

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
