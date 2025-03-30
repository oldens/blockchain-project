import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase-config.js";

// Надсилаємо повідомлення та зберігаємо його у колекції "messages" у Firestore
async function sendMessage() {
    const sender = document.getElementById("sender")?.value;
    const message = document.getElementById("message")?.value;
    const signature = document.getElementById("signature")?.value;
    const publicKey = document.getElementById("publicKey")?.innerText;

    if (!sender || !message || !signature || !publicKey) {
        alert("Заповніть всі необхідні дані та згенеруйте ключі!");
        return;
    }

    try {
        await addDoc(collection(db, "messages"), {
            sender,
            message,
            signature,
            publicKey,
            timestamp: new Date() // використовується для сортування повідомлень
        });

        ["sender", "message", "signature"].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = "";
        });

        displayMessages();
    } catch (error) {
        console.error("Помилка надсилання повідомлення:", error);
    }
}

// Отримуємо повідомлення з Firestore і відображаємо їх на сторінці
async function displayMessages() {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";

    const messagesQuery = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(messagesQuery);
    let index = 0;

    querySnapshot.forEach((doc) => {
        const msg = doc.data();
        const div = document.createElement("div");
        div.innerHTML = `
            <strong>${msg.sender}</strong>: ${msg.message} <em>(${msg.signature})</em>
            <br>
            <span id="validity-icon-${index}" class="validity-icon"></span>
        `;
        messagesDiv.appendChild(div);
        index++;
    });
}

// Attach event listeners after DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded");
  document.getElementById('sendMessageBtn')?.addEventListener('click', sendMessage);

  // Optionally, display messages immediately after load:
  displayMessages();
});
