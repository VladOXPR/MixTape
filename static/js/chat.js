
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

let form = document.getElementById("myform")

form.addEventListener("submit", sendChat)
form.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault(); // Prevent the default action
        form.dispatchEvent(new Event('submit')); // Programmatically trigger the form submission
    }
});



function sendChat(e) {
    if (e) e.preventDefault();
    let chatMessage = document.getElementById("id_body").value;
    console.log(chatMessage);

    if (chatMessage) {

        const data = {msg: chatMessage};

        async function postJSON(data) {
            try {
                const response = await fetch(sent_url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();
                console.log("Sent Message:", result);

                let chatBody = document.getElementById("chat-body")
                let chatMessageContainer = document.createElement("div")
                chatMessageContainer.classList.add("message-container")

                let chatMessageBubble = document.createElement("div")
                chatMessageBubble.classList.add("message-sent")

                chatMessageBubble.innerText = data.msg
                chatMessageContainer.append(chatMessageBubble)

                chatBody.append(chatMessageContainer)
                document.getElementById("id_body").value = ""

            } catch (error) {
                console.error("Error:", error);
                console.log("HTML Content:", await response.text());
            }
        }

        postJSON(data);
    }
}

let counter = 0;

// Modified receiveMessage function with an additional parameter
function receiveMessage(updateDOM = true) {
    fetch(rec_url)
        .then(response => response.json())
        .then(data => {
            console.log("Message Check:", data[0]);

            if (data.length > 0 && updateDOM) {
                let lastMsg = data[0]; // Assuming you want the first message in the array

                if (counter < data.length) {
                    let chatBody = document.getElementById("chat-body");
                    let chatMessageContainer = document.createElement("div");
                    chatMessageContainer.classList.add("message-container");

                    let chatMessageBubble = document.createElement("div");
                    chatMessageBubble.classList.add("message-received");

                    chatMessageBubble.innerText = lastMsg; // Assuming lastMsg is the message text
                    chatMessageContainer.append(chatMessageBubble);

                    chatBody.append(chatMessageContainer);
                    document.getElementById("id_body").value = "";
                }
            }

            // Update counter regardless of whether messages are appended to the DOM
            counter = data.length;
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

// Call receiveMessage on page load without updating the DOM
document.addEventListener("DOMContentLoaded", function() {
    receiveMessage(false);
});

// Continue to call receiveMessage as before for regular updates
setInterval(receiveMessage, 2500);
