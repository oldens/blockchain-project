import { addBlockToDatabase, getAllBlocks } from "./database.js";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase-config.js";

// Ініціалізуємо elliptic із алгоритмом secp256k1
const ec = new elliptic.ec('secp256k1');
let keyPair;

// Функція для додавання блоку (якщо потрібна окрема роздільна логіка для блокчейну)
function addBlock() {
    const senderAddress = document.getElementById("senderAddress")?.value;
    const amount = parseFloat(document.getElementById("amount")?.value);
    const receivers = document.getElementById("receivers")?.value.split(',');
    const publicKey = document.getElementById("publicKey")?.value;
    const signature = document.getElementById("signature")?.value;

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
        publicKey,
        signature
    };

    addBlockToDatabase(block);

    if(document.getElementById("senderAddress")) document.getElementById("senderAddress").value = "";
    if(document.getElementById("amount")) document.getElementById("amount").value = "";
    if(document.getElementById("receivers")) document.getElementById("receivers").value = "";
    if(document.getElementById("publicKey")) document.getElementById("publicKey").value = "";
    if(document.getElementById("signature")) document.getElementById("signature").value = "";
}

// Відображаємо блокчейн, використовуючи getAllBlocks з database.js
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
                    ${block.receivers ? block.receivers.map(receiver => `<li>${receiver.address}: ${receiver.amount}</li>`).join('') : ''}
                </ul>
                <p><strong>Публічний ключ:</strong> ${block.publicKey}</p>
                <p><strong>Підпис:</strong> ${block.signature}</p>
            `;
            blockchain.appendChild(blockElement);
        });
    });
}

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
        await addBlockToDatabase({
            sender,
            message,
            signature,
            publicKey,
            timestamp: new Date() // використовується для сортування повідомлень
        });

        if(document.getElementById("sender")) document.getElementById("sender").value = "";
        if(document.getElementById("message")) document.getElementById("message").value = "";
        if(document.getElementById("signature")) document.getElementById("signature").value = "";

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
            <button class="btn btn-sm btn-info" onclick="verifyMessage('${msg.message.replace(/'/g, "\\'")}', '${msg.signature}', '${msg.publicKey}', ${index})">
                Перевірити валідність
            </button>
            <span id="validity-icon-${index}" class="validity-icon"></span>
        `;
        messagesDiv.appendChild(div);
        index++;
    });
}

// Функція перевірки підпису
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

// Генеруємо ключі з використанням elliptic
function generateKeys() {
  keyPair = ec.genKeyPair();
  const pubKey = keyPair.getPublic('hex');
  document.getElementById("publicKey").innerText = pubKey;
  alert("Ключі згенеровано!");
}

// Підписуємо повідомлення з використанням згенерованого ключа
function signMessage() {
  const message = document.getElementById("message")?.value;
  if (!keyPair) {
    alert("Спершу згенеруйте ключі!");
    return;
  }
  const hash = CryptoJS.SHA256(message).toString();
  const signatureObj = keyPair.sign(hash);
  const sigHex = signatureObj.toDER('hex');
  document.getElementById("signature").value = sigHex;
}

// Attach event listeners after DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded");
  document.getElementById('generateKeysBtn').addEventListener('click', generateKeys);
  document.getElementById('signMessageBtn').addEventListener('click', signMessage);
  document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);

  // Optionally, display messages immediately after load:
  displayMessages();
});

