function adjustFontSize() {
    const container = document.getElementById('bio-text');
    const text = document.getElementById('id_bio');

    let fontSize = 10; // Starting font size
    text.style.fontSize = fontSize + 'px';

    // Increase font size until it no longer fits
    while (text.scrollWidth <= container.offsetWidth && text.scrollHeight <= container.offsetHeight) {
        fontSize++;
        text.style.fontSize = fontSize + 'px';
    }

    // Once it overflows, revert to the last fitting size
    fontSize--;
    text.style.fontSize = fontSize + 'px';
}

// Initial adjust and readjust on window resize
window.onload = adjustFontSize;
document.addEventListener('DOMContentLoaded', adjustFontSize);
window.addEventListener('resize', adjustFontSize);

