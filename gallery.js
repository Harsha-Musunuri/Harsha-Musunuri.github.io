const imageGallery = document.getElementById('imageGallery');
const imageNames = ['1.png', '2.png', '3.jpg', '4.jpg', '5.jpg']; // Add all your image names here
let loadedImages = [];
let scrollAmount = 0;
let scrollAnimation;
let isPaused = false;

async function loadImages() {
    for (let imageName of imageNames) {
        try {
            const img = await loadImage(`gallery/${imageName}`);
            loadedImages.push(img.src);
            console.log(`Successfully loaded: ${imageName}`);
        } catch (error) {
            console.error(`Failed to load image: ${imageName}`, error);
        }
    }

    console.log(`Loaded ${loadedImages.length} images:`, loadedImages);
    initializeGallery();
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });
}

function createImageElement(src) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Gallery Image';
    return img;
}

function initializeGallery() {
    imageGallery.innerHTML = ''; // Clear existing content

    if (loadedImages.length === 0) {
        console.error('No images were successfully loaded.');
        imageGallery.innerHTML = '<p></p>';
        return;
    }

    if (loadedImages.length === 1) {
        // If only one image, display it without scrolling
        const singleImage = createImageElement(loadedImages[0]);
        singleImage.style.maxWidth = '100%';
        singleImage.style.height = 'auto';
        imageGallery.appendChild(singleImage);
        return;
    }

    // Multiple images: set up scrolling gallery
    const innerGallery = document.createElement('div');
    innerGallery.className = 'image-gallery-inner';

    // Calculate how many times we need to repeat the images to fill the gallery
    const galleryWidth = imageGallery.offsetWidth;
    let totalWidth = 0;
    const imagesToAdd = [];
    while (totalWidth < galleryWidth * 2) { // Fill at least 2 screen widths
        loadedImages.forEach(src => {
            imagesToAdd.push(src);
            totalWidth += 200 + 20; // Approximate width of image + gap
        });
    }

    // Add images to the inner gallery
    imagesToAdd.forEach(src => {
        innerGallery.appendChild(createImageElement(src));
    });

    imageGallery.appendChild(innerGallery);

    // Start the infinite scroll
    startInfiniteScroll(innerGallery);

    // Add event listeners for hover functionality
    imageGallery.addEventListener('mouseenter', () => {
        isPaused = true;
    });

    imageGallery.addEventListener('mouseleave', () => {
        isPaused = false;
    });
}

function startInfiniteScroll(element) {
    const step = () => {
        if (!isPaused) {
            scrollAmount += 0.15; // Adjust this value to change scroll speed

            // If we've scrolled past the first image, move it to the end
            if (scrollAmount >= element.firstElementChild.offsetWidth + 20) { // +20 for the gap
                const firstImage = element.firstElementChild;
                element.removeChild(firstImage);
                element.appendChild(firstImage);
                scrollAmount -= firstImage.offsetWidth + 20;
            }

            element.style.transform = `translateX(-${scrollAmount}px)`;
        }

        scrollAnimation = requestAnimationFrame(step);
    };
    scrollAnimation = requestAnimationFrame(step);
}

// Load images and initialize gallery
loadImages().catch(error => {
    console.error('An error occurred while loading images:', error);
    imageGallery.innerHTML = '<p>An error occurred while loading images. Please check the console for more information.</p>';
});