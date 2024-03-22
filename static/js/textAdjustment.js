function adjustFontSize(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let fontSize = parseInt(window.getComputedStyle(container).fontSize);
        const maxHeight = container.clientHeight;
        const maxWidth = container.clientWidth;

        // Temporarily set overflow to detect changes
        container.style.overflow = 'hidden';

        while (container.scrollHeight > maxHeight || container.scrollWidth > maxWidth) {
            fontSize--;
            container.style.fontSize = `${fontSize}px`;
            if (fontSize <= 0) break; // Prevent infinite loop
        }

        // Optionally, increase font size if there's extra space
        while (container.scrollHeight <= maxHeight && container.scrollWidth <= maxWidth && fontSize < 100) {
            fontSize++;
            container.style.fontSize = `${fontSize}px`;
            // Revert last increment if it causes overflow
            if (container.scrollHeight > maxHeight || container.scrollWidth > maxWidth) {
                fontSize--;
                container.style.fontSize = `${fontSize}px`;
                break;
            }
        }

        // Remove temporary style
        container.style.overflow = '';
    }

    // Call the function with the ID of your container
    adjustFontSize('bio-text');