document.addEventListener('DOMContentLoaded', function () {
    const codeModals = document.querySelectorAll('[id^="codeModal"]');
    
    codeModals.forEach((modal) => {
        // Display each modal automatically
        modal.style.display = 'block';

        // Add close event listener if needed for each modal
        const closeModalBtn = modal.querySelector('.closeModalBtn');

        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Handle micCodeModal separately if needed
    const micCodeModal = document.getElementById('micCodeModal');
    const micCloseModalBtn = micCodeModal.querySelector('.closeModalBtn');

    micCloseModalBtn.addEventListener('click', () => {
        micCodeModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === micCodeModal) {
            micCodeModal.style.display = 'none';
        }
    });
});
