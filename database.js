import { db, ref, set, onValue } from "./firebase-config.js";
 
// Додає блок до бази
export async function addBlockToDatabase(block) {
    try {
        const timestamp = Date.now();  // Унікальний ключ
        await set(ref(db, `blockchain/${timestamp}`), block);
        console.log("✅ Блок успішно додано!");
    } catch (error) {
        console.error("❌ Помилка при додаванні блоку:", error);
    }
}
 
// Отримує всі блоки з бази та повертає їх як Promise
export function getAllBlocks() {
    return new Promise((resolve, reject) => {
        const blockchainRef = ref(db, 'blockchain/');

        onValue(
            blockchainRef,
            (snapshot) => {
                const data = snapshot.val();
                let blocks = [];

                if (data) {
                    for (const key in data) {
                        const block = data[key];
                        block.timestamp = parseInt(key); // додаємо timestamp з ключа
                        blocks.push(block);
                    }

                    // тепер сортування буде працювати
                    blocks.sort((a, b) => b.timestamp - a.timestamp);
                }

                resolve(blocks);
                displayMessages(blocks);
            },
            (error) => {
                reject(error);
            }
        );
    });
}

// Отримуємо повідомлення (блоки) з блокчейну та відображаємо їх на сторінці
async function displayMessages(blocks) {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";

    try {
        blocks.forEach((block, index) => {
            const div = document.createElement("div");
            div.classList.add("card", "mb-3", "p-3"); // Using Bootstrap card styling
            div.innerHTML = `
                <p><strong>Відправник:</strong> ${block.sender || "Не вказано"}</p>
                <p><strong>Повідомлення:</strong> ${block.message || "Не вказано"}</p>
                <p><strong>Підпис:</strong> ${block.signature || "Не вказано"}</p>
                <p><strong>Публічний ключ:</strong> ${block.publicKey || "Не вказано"}</p>
                <p><strong>Час:</strong> ${block.timestamp ? new Date(block.timestamp).toLocaleString() : "Не вказано"}</p>
                <span id="validity-icon-${index}" class="validity-icon"></span>
            `;
            messagesDiv.appendChild(div);
        });
    } catch (error) {
        console.error("Помилка отримання повідомлень:", error);
    }
}