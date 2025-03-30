import { addBlockToDatabase, getAllBlocks } from "./database.js";

// Надсилаємо повідомлення та зберігаємо його у блокчейні через addBlockToDatabase
async function sendMessage() {
    const sender = document.getElementById("sender")?.value;
    const message = document.getElementById("message")?.value;
    const signature = document.getElementById("signature")?.value;
    const publicKey = document.getElementById("publicKey")?.innerText;

 

    try {
        await addBlockToDatabase({
            sender,
            message,
            signature,
            publicKey,
            timestamp: new Date() // використовується для сортування повідомлень
        });

        ["sender", "message", "signature","publicKey"].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = "";
        });

    } catch (error) {
        console.error("Помилка надсилання повідомлення:", error);
    }
}



// Attach event listeners after DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");
    document.getElementById('sendMessageBtn')?.addEventListener('click', sendMessage);
    getAllBlocks() 
});
