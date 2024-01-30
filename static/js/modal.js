const codeModal = document.getElementById('codeModal');

// Display the modal automatically
codeModal.style.display = 'block';

// Add close event listener if needed
const closeModalBtn = document.getElementById('closeModalBtn');

closeModalBtn.addEventListener('click', () => {
    codeModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === codeModal) {
        codeModal.style.display = 'none';
    }
});