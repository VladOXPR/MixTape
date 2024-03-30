document.addEventListener('DOMContentLoaded', function () {
    console.log('loaded')
    const signUpForm = document.getElementById('signUpForm');
    const loginError = document.getElementById('loginError');
    const email = document.getElementById('id_email')
    const username = document.getElementById('id_username')
    const password = document.getElementById('id_password')
    const button = document.getElementById('button')
    const csrf = document.getElementsByName('csrfmiddlewaretoken')

    button.addEventListener('click', function (event) {
        event.preventDefault();
        console.log('clicked');
        const fd = new FormData();
        fd.append('csrfmiddlewaretoken', csrf[0].value);

        fd.append('email', email.value);
        fd.append('username', username.value);
        fd.append('password1', password.value);
        console.log(username.value)
        console.log(password.value)
        console.log(csrf[0].value)

        $.ajax({
            type: 'POST',
            url: signUpForm.action,
            enctype: 'multipart/form-data',
            data: fd,
            headers: {
                'X-CSRFToken': csrf[0].value,
            },
            success: function (response) {
                console.log('success');
                console.log(response.errors);
                if (response.redirect_url) {
                    window.location.href = response.redirect_url;
                }
            },
            error: function (response) {
                    loginError.style.display = 'flex';
                    console.log('inner style changed')

            },
            cache: false,
            contentType: false,
            processData: false,
        });
    })
});
