import { addBlockToDatabase, getAllBlocks } from "./database.js";

// Додає блок через абстрактний метод
function addBlock() {
    const senderAddress = document.getElementById("senderAddress").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const receivers = document.getElementById("receivers").value.split(',');
    const publicKey = document.getElementById("publicKey").value;
    const signature = document.getElementById("signature").value;

    if (!senderAddress || isNaN(amount) || receivers.length === 0 || !publicKey || !signature) {

        alert("Введіть всі необхідні дані!");
        return;
    }

    const block = {
        sender: senderAddress,
        receivers: receivers.map(receiver => ({
            address: receiver.trim(),
            amount: amount / receivers.length
        })),
        publicKey: publicKey,
        signature: signature
    };


    addBlockToDatabase(block);
    document.getElementById("senderAddress").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("receivers").value = "";
    document.getElementById("publicKey").value = "";
    document.getElementById("signature").value = "";
}

// Відображає блокчейн через абстрактний метод
function displayBlockchain() {
    const blockchain = document.getElementById("blockchain");
    blockchain.innerHTML = "";  // Очистимо перед виведенням

    getAllBlocks((blocks) => {
        blocks.forEach(block => {
            const blockElement = document.createElement("div");
            blockElement.className = "block";
            blockElement.innerHTML = `
                <p><strong>Відправник:</strong> ${block.sender}</p>
                <p><strong>Отримувачі:</strong></p>
                <ul>
                    ${block.receivers.map(receiver => `<li>${receiver.address}: ${receiver.amount}</li>`).join('')}
                </ul>
                <p><strong>Публічний ключ:</strong> ${block.publicKey}</p>
                <p><strong>Підпис:</strong> ${block.signature}</p>
            `;
            blockchain.appendChild(blockElement);
        });
    });
}

// Показуємо блокчейн при завантаженні
displayBlockchain();

// Експортуємо функцію додавання
window.addBlock = addBlock;

function displayMessages() {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = '';
    const db = JSON.parse(localStorage.getItem('dbMessages')) || [];
    db.forEach((msg, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <strong>${msg.sender}</strong>: ${msg.message} <em>(${msg.signature})</em>
            <br>
            <button onclick="verifyMessage('${msg.message.replace(/'/g, "\\'")}', '${msg.signature}', '${msg.publicKey}')">Перевірити валідність</button>
            <span id="validity-icon-${index}" class="validity-icon"></span>
        `;
        messagesDiv.appendChild(div);
    });
}

function verifyMessage(message, signature, publicKey, index) {
    const hash = CryptoJS.SHA256(message).toString();
    let keyFromPub;
    try {
        keyFromPub = ec.keyFromPublic(publicKey, "hex");
    } catch (e) {
        alert("Невірний публічний ключ!");
        return;
    }
    const valid = keyFromPub.verify(hash, signature);
    const icon = document.getElementById(`validity-icon-${index}`);
    if (valid) {
        icon.innerHTML = "✔️";
        icon.classList.add("valid");
    } else {
        icon.innerHTML = "❌";
        icon.classList.add("invalid");
    }
}
