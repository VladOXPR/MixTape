document.addEventListener('DOMContentLoaded', function () {
    const projectForm = document.getElementById('project-form')
    const imageBox = document.getElementById('image-box')
    const confirmBtn = document.getElementById('confirm-btn')

    const imageInput = document.getElementById('id_coverimg')
    const titleInput = document.getElementById('id_title')

    const csrf = document.getElementsByName('csrfmiddlewaretoken')

    // creates cropper function and submits data
    imageInput.addEventListener('change', () => {
        console.log('file chosen')
        const img_data = imageInput.files[0];
        const url = URL.createObjectURL(img_data);

        imageBox.innerHTML = '<img src="' + url + '" id="image" alt="/media/blank-profile-picture.png" class="image-box">';

        const image = document.getElementById('image');

        const cropper = new Cropper(image, {
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
        confirmBtn.addEventListener('click', () => {
            cropper.getCroppedCanvas().toBlob((blob) => {
                sendFormData(blob)
                const newUrl = URL.createObjectURL(blob);
                imageBox.innerHTML = '<img src="' + newUrl + '" id="image" style="height: 100%; width: 100%">';
            });
            cropper.destroy()
        });
    });

    // submits data if no new image is chosen
    confirmBtn.addEventListener('click', () => {
        sendFormData()
    });


    // ajax function that submits form data
    function sendFormData(blob = null) {
        console.log('clicked', blob);
        const fd = new FormData();
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