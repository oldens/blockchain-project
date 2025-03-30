import { addBlockToDatabase, getAllBlocks } from "./database.js";

// Додає блок через абстрактний метод
function addBlock() {
    const senderAddress = document.getElementById("senderAddress").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const receivers = document.getElementById("receivers").value.split(',');

    if (!senderAddress || isNaN(amount) || receivers.length === 0) {
        alert("Введіть всі необхідні дані!");
        return;
    }

    const block = {
        sender: senderAddress,
        receivers: receivers.map(receiver => ({
            address: receiver.trim(),
            amount: amount / receivers.length
        }))
    };

    addBlockToDatabase(block);
    document.getElementById("senderAddress").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("receivers").value = "";
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
            `;
            blockchain.appendChild(blockElement);
        });
    });
}

// Показуємо блокчейн при завантаженні
displayBlockchain();

// Експортуємо функцію додавання
window.addBlock = addBlock;
