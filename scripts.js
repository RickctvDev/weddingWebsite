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
    const imagesPerBatch = 50; // Number of images to load per batch
    const totalImages = 662; // Assuming there are 700 images
    const maxRetries = 3; // Number of times to retry loading an image
    const problemImageStartIndex = 661; // Index where issues begin (adjusted for zero-indexing)

    // Update year dynamically
    const yearElement = document.getElementById("yearIs");
    const currentYear = new Date().getFullYear();
    yearElement.textContent = currentYear;

    // Function to load a batch of images
    function loadImageBatch(startIndex) {
        const fragment = document.createDocumentFragment();
        for (let i = startIndex; i < startIndex + imagesPerBatch && i < totalImages; i++) {
            const imagePath = `src/assets/A&Rphoto${i + 1}.jpg`;
            const card = document.createElement("div");
            card.className = "card";
            card.style.width = "18rem";
            loadImageWithFallback(card, imagePath, i);
            fragment.appendChild(card);
        }
        photoContainer.appendChild(fragment);
        currentIndex += imagesPerBatch;
        updateThumbnails(); // Update thumbnails as more images are loaded
    }

    // Function to load an image with retries and fallback
    function loadImageWithFallback(card, src, index, retries = maxRetries) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            card.innerHTML = `<img class="card-img-top" src="${img.src}" loading="lazy" alt="Card ${index + 1}">`;
            card.addEventListener("click", () => showImage(index));
        };
        img.onerror = () => {
            if (retries > 0) {
                console.log(`Retrying to load image: ${src}, retries left: ${retries - 1}`);
                setTimeout(() => loadImageWithFallback(card, src, index, retries - 1), 500);
            } else {
                console.error(`Failed to load image: ${src}. Displaying placeholder.`);
                card.innerHTML = `<div class="card-img-top placeholder" style="height: 18rem; background-color: #ddd; display: flex; align-items: center; justify-content: center;">Image Not Available</div>`;
            }
        };
    }

    function showImage(index) {
        modalImage.src = `src/assets/A&Rphoto${index + 1}.jpg`;
        photoModal.show();
        updateThumbnails();
        setTimeout(scrollToCurrentThumbnail, 300);
    }

    function updateThumbnails() {
        carouselThumbnails.innerHTML = '';
        for (let i = 0; i < currentIndex; i++) {
            const thumbnail = document.createElement("img");
            thumbnail.src = `src/assets/A&Rphoto${i + 1}.jpg`;
            thumbnail.className = i === currentIndex ? 'active large-thumbnail' : '';
            thumbnail.addEventListener("click", () => showImage(i));
            carouselThumbnails.appendChild(thumbnail);
        }
    }

    function scrollToCurrentThumbnail() {
        const activeThumbnail = document.querySelector("#carouselThumbnails img.active");
        if (activeThumbnail) {
            const containerWidth = carouselThumbnails.clientWidth;
            const scrollLeft = activeThumbnail.offsetLeft + activeThumbnail.clientWidth / 2 - containerWidth / 2;
            carouselThumbnails.scrollLeft = scrollLeft;
        }
    }

    prevImageBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        showImage(currentIndex);
        setTimeout(scrollToCurrentThumbnail, 300);
    });

    nextImageBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalImages;
        showImage(currentIndex);
        setTimeout(scrollToCurrentThumbnail, 300);
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

    // Infinite scroll logic to load more images when the user scrolls down
    function onScroll() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
            if (currentIndex < problemImageStartIndex) {
                loadImageBatch(currentIndex);
            } else {
                // Load remaining images (662 onwards) in one go
                loadImageBatch(problemImageStartIndex);
                window.removeEventListener('scroll', onScroll); // Stop infinite scroll after all images are loaded
            }
        }
    }

    window.addEventListener('scroll', onScroll);

    // Initial load of images
    loadImageBatch(0);
});
