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
    const maxRetries = 3;

    // Update year dynamically
    const yearElement = document.getElementById("yearIs");
    const currentYear = new Date().getFullYear();
    yearElement.textContent = currentYear;

    const images = [];
    for (let i = 1; i <= 163; i++) {
        const paddedNumber = String(i).padStart(3, '0');
        const imagePath = `src/assets/A&Rphoto${paddedNumber}.jpg`;
        images.push(imagePath);
    }

    function loadImage(src, retries, callback) {
        const img = new Image();
        img.src = src;
        img.onload = () => callback(null, img);
        img.onerror = () => {
            if (retries > 0) {
                console.log(`Retrying to load image: ${src}, retries left: ${retries - 1}`);
                setTimeout(() => loadImage(src, retries - 1, callback), 500);
            } else {
                callback(new Error(`Failed to load image: ${src}`), img);
            }
        };
    }

    function loadAllImages(callback) {
        let loadedImages = 0;
        const totalImages = images.length;
        images.forEach((src, index) => {
            loadImage(src, maxRetries, (err, img) => {
                if (err) {
                    console.error(err.message);
                } else {
                    const card = document.createElement("div");
                    card.className = "card";
                    card.style.width = "18rem";
                    card.innerHTML = `<img class="card-img-top" src="${img.src}" alt="Card ${index}">`;
                    card.addEventListener("click", () => {
                        showImage(index);
                    });
                    photoContainer.appendChild(card);
                }
                loadedImages++;
                if (loadedImages === totalImages) {
                    callback();
                }
            });
        });
    }

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

    // Load all images initially and then update the UI
    loadAllImages(() => {
        console.log("All images loaded successfully.");
        // Initialize the thumbnails and other UI components as needed
        updateThumbnails();
    });
});
