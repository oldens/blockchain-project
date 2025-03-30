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

// Отримує всі блоки з бази
export function getAllBlocks(callback) {
    const blockchainRef = ref(db, 'blockchain/');
    onValue(blockchainRef, (snapshot) => {
        const data = snapshot.val();
        const blocks = [];
        
        if (data) {
            for (const key in data) {
                blocks.push(data[key]);
            }
        }
        callback(blocks);
    });
}
