
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
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

function sendChat(e) {
    e.preventDefault()
    let chatMessage = document.getElementById("id_body").value
    console.log(chatMessage)

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
            let chatMessageBubble = document.createElement("div")
            chatMessageBubble.classList.add("sender-chats")
            chatMessageBubble.innerText = data.msg
            chatBody.append(chatMessageBubble)
            document.getElementById("id_body").value = ""

        } catch (error) {
            console.error("Error:", error);
            console.log("HTML Content:", await response.text());
        }
    }

    postJSON(data);
}

setInterval(receiveMessage, 2000);

let counter = 0

function receiveMessage() {

    fetch(rec_url)
        .then(response => response.json())
        .then(data => {
            console.log("Message Check:");

            if (data.length === 0) {
            } else {

                let lastMsg = data[data.length - 1]

                if (counter === data.length) {
                    console.log("There is no new chat")
                } else {
                    let chatBody = document.getElementById("chat-body")
                    let chatMessageBubble = document.createElement("div")
                    chatMessageBubble.classList.add("receiver-chats")
                    chatMessageBubble.innerText = lastMsg
                    chatBody.append(chatMessageBubble)
                    document.getElementById("id_body").value = ""

                    console.log("Received Message:", lastMsg);

                }
            }

            counter = data.length
        })
        .catch(error => {
            console.error("Error:", error);
        });
}
