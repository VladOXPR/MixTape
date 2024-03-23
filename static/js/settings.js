document.addEventListener('DOMContentLoaded', function () {

    const settingsForm = document.getElementById('settings-form')
    const imageBox = document.getElementById('image-box')
    const confirmBtn = document.getElementById('confirm-btn')

    const imageInput = document.getElementById('id_profileimg')
    const nameInput = document.getElementById('id_name')
    const bioInput = document.getElementById('id_bio')

    const csrf = document.getElementsByName('csrfmiddlewaretoken')

    let cropper = null; // Initialize cropper variable

    imageInput.addEventListener('change', () => {
        console.log('file chosen')
        const img_data = imageInput.files[0];
        const url = URL.createObjectURL(img_data);

        imageBox.innerHTML = '<img src="' + url + '" id="image" alt="/media/blank-profile-picture.png">';
        const image = document.getElementById('image');

        if (cropper !== null) {
            cropper.destroy(); // Destroy the previous cropper instance if exists
        }

        cropper = new Cropper(image, {
            aspectRatio: 1,
            zoomable: false,
            viewMode: 2,

            crop(event) {
                console.log(event.detail.x);
                console.log(event.detail.y);
                console.log(event.detail.width);
                console.log(event.detail.height);
                console.log(event.detail.rotate);
                console.log(event.detail.scaleX);
                console.log(event.detail.scaleY);
            },
        });
    });

    // Combined event listener for the confirm button
    confirmBtn.addEventListener('click', () => {
        console.log('saved changes')
        if (cropper) {
            cropper.getCroppedCanvas().toBlob((blob) => {
                sendFormData(blob); // Send the cropped image blob
                const newUrl = URL.createObjectURL(blob);
                imageBox.innerHTML = '<img src="' + newUrl + '" id="image" style="height: 100%; width: 100%">';
                cropper.destroy(); // Destroy cropper after use
                cropper = null; // Reset the cropper variable
            });
        } else {
            sendFormData(); // Send form data without a new image
        }
    });

    function sendFormData(blob = null) {
        console.log('clicked', blob);
        const fd = new FormData();
        fd.append('csrfmiddlewaretoken', csrf[0].value);
        if (blob) {
            fd.append('profileimg', blob, 'pfp.png');
        }
        fd.append('name', nameInput.value);
        fd.append('bio', bioInput.value);
        // fd.append('fav_proj', favProjInput.value)

        $.ajax({
            type: 'POST',
            url: settingsForm.action,
            enctype: 'multipart/form-data',
            data: fd,
            headers: {
                'X-CSRFToken': csrf[0].value,
            },
            success: function (response) {
                console.log('success', response);
            },
            error: function (error) {
                console.log('error', error);
            },
            cache: false,
            contentType: false,
            processData: false,
        });
    }

});
