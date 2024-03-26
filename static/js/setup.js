document.addEventListener('DOMContentLoaded', function () {
    const projectForm = document.getElementById('project-form');
    const imageBox = document.getElementById('image-box');
    const confirmBtn = document.getElementById('confirm-btn');

    const titleInput = document.getElementById('id_title');
    const imageInput = document.getElementById('id_coverimg');
    const csrf = document.getElementsByName('csrfmiddlewaretoken');

    let cropper = null; // Initialize cropper to null

    imageInput.addEventListener('change', () => {
        console.log('file chosen');
        const img_data = imageInput.files[0];
        const url = URL.createObjectURL(img_data);

        imageBox.innerHTML = `<img src="${url}" id="image" alt="/media/blank-profile-picture.png" class="image-box">`;

        const image = document.getElementById('image');

        // Initialize cropper if image is chosen
        cropper = new Cropper(image, {
            aspectRatio: 1,
            zoomable: false,
            viewMode: 2,
            crop(event) {
                console.log(event.detail);
            },
        });
    });

    confirmBtn.addEventListener('click', (event) => {
        event.preventDefault();
        if (cropper) {
            // If cropper is initialized, get the cropped image blob
            cropper.getCroppedCanvas().toBlob((blob) => {
                sendFormData(blob);
                imageBox.innerHTML = `<div style="display: none;"></div>`;
                cropper.destroy();
                cropper = null; // Reset cropper to null
            });
        } else {
            // If no image was chosen for cropping, just send the form data
            sendFormData();
        }
    });

    function sendFormData(blob = null) {
        console.log('clicked', blob);
        const fd = new FormData(projectForm);
        fd.append('csrfmiddlewaretoken', csrf[0].value);
        if (blob) {
            fd.append('coverimg', blob, 'pfp.png');
        }
        fd.append('title', titleInput.value);

        $.ajax({
            type: 'POST',
            url: projectForm.action,
            enctype: 'multipart/form-data',
            data: fd,
            headers: {
                'X-CSRFToken': csrf[0].value,
            },
            success: function (response) {
                console.log('success', response)
                if (response.redirect_url) {
                    window.location.href = response.redirect_url;
                }
            },
            error: function (error) {
                console.log('error', error);
                // Error handling logic here
            },
            cache: false,
            contentType: false,
            processData: false,
        });
    }
});
