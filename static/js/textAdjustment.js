function adjustFontSize(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Store the original overflow value
    const originalOverflow = container.style.overflow;
    container.style.overflow = 'hidden';

    let fontSize = parseInt(window.getComputedStyle(container).fontSize, 10);
    const maxHeight = container.clientHeight;
    const maxWidth = container.clientWidth;

    // Decrease font size to prevent overflow
    while ((container.scrollHeight > maxHeight || container.scrollWidth > maxWidth) && fontSize > 10) { // Set a minimum font size to maintain readability
        fontSize--;
        container.style.fontSize = `${fontSize}px`;
    }

    // Optionally, increase font size if there's extra space
    while (container.scrollHeight <= maxHeight && container.scrollWidth <= maxWidth && fontSize < 100) { // You might adjust the 100px maximum size or remove this condition
        fontSize++;
        container.style.fontSize = `${fontSize}px`;
        if (container.scrollHeight > maxHeight || container.scrollWidth > maxWidth) {
            fontSize--;
            container.style.fontSize = `${fontSize}px`;
            break;
        }
    }

    // Restore the original overflow value
    container.style.overflow = originalOverflow;
}

// Call the function with the ID of your container
adjustFontSize('bio-text');
