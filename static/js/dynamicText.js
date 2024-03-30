function adjustFontSize() {
    const container = document.getElementById('bio-text');
    const text = document.getElementById('id_bio');

    if (!container || !text) {
        console.log('One or more elements are not found.');
        return; // Exit if elements are not found
    }

    let fontSize = 10; // Starting font size
    const maxFontSize = 36; // Maximum font size
    const minFontSize = 10; // Minimum font size

    text.style.fontSize = `${fontSize}px`;

    while (text.scrollWidth <= container.offsetWidth &&
    text.scrollHeight <= container.offsetHeight &&
    fontSize <= maxFontSize) {
        fontSize++;
        text.style.fontSize = `${fontSize}px`;
    }

    if (fontSize > minFontSize) fontSize--;
    text.style.fontSize = `${fontSize}px`;

    if (fontSize < minFontSize) {
        text.style.fontSize = `${minFontSize}px`;
    }
}

// Run adjustFontSize after the page initially loads
window.onload = adjustFontSize;
document.addEventListener('DOMContentLoaded', adjustFontSize);
window.addEventListener('resize', adjustFontSize);

// Setup a Mutation Observer to monitor changes in the container
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
            adjustFontSize(); // Run adjustFontSize if there are changes
        }
    });
});

// Start observing the container for changes in its children or subtree
const config = {attributes: true, childList: true, subtree: true};
const container = document.getElementById('bio-text');
if (container) {
    observer.observe(container, config);
} else {
    console.log('Container for observing not found');
}
