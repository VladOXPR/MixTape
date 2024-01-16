document.addEventListener('DOMContentLoaded', function () {


    const settingsForm = document.getElementById('settings-form')
    const imageBox = document.getElementById('image-box')
    const confirmBtn = document.getElementById('confirm-btn')

    const imageInput = document.getElementById('id_profileimg')

    const nameInput = document.getElementById('id_name')
    const bioInput = document.getElementById('id_bio')

    const csrf = document.getElementsByName('csrfmiddlewaretoken')

    imageInput.addEventListener('change', () => {
        console.log('file chosen')
        const img_data = imageInput.files[0];
        const url = URL.createObjectURL(img_data);

        imageBox.innerHTML = '<img src="' + url + '" id="image" alt="/media/blank-profile-picture.png">';

        const image = document.getElementById('image');

        const cropper = new Cropper(image, {
            aspectRatio: 1,
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
        confirmBtn.addEventListener('click', () => {
            cropper.getCroppedCanvas().toBlob((blob) => {
                sendFormData(blob)
            });
        }); //
    });

    confirmBtn.addEventListener('click', () => {
        sendFormData()
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

        $.ajax({
            type: 'POST',
            url: settingsForm.action,
            enctype: 'multipart/form-data',
            data: fd,
            success: function (response) {
                console.log('success', response)
            },
            error: function (error) {
                console.log('error', error)
            },

            cache: false,
            contentType: false,
            processData: false,
        });
    }

});