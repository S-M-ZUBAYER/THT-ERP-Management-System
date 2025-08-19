import { openDB } from 'idb';

const DB_NAME = 'LiveChatDB';
const STORE_NAME = 'chats';

// ✅ Open or create the database with an incremented version
export const initDB = async () => {
    return await openDB(DB_NAME, 2, { // ✅ Changed version to ensure store creation
        upgrade(db, oldVersion, newVersion) {
            console.log(`Upgrading DB from version ${oldVersion} to ${newVersion}`);

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "chatKey" });
                console.log(`Object store '${STORE_NAME}' created.`);
            }
        },
    });
};

// ✅ Save messages in IndexedDB
export const saveMessagesToDB = async (chatKey, messages) => {
    console.log("Messages Type:", typeof messages, "Is Array:", Array.isArray(messages), messages);

    if (!Array.isArray(messages)) {
        messages = [messages];
    }

    const db = await initDB();

    // ✅ Ensure object store exists before attempting transaction
    if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.error(`Object store '${STORE_NAME}' does not exist!`);
        return;
    }

    const existingChat = (await db.get(STORE_NAME, chatKey)) || { chatKey, messages: [] };

    existingChat.messages.push(...messages);
    await db.put(STORE_NAME, existingChat);
};

// ✅ Get messages from IndexedDB
export const getMessagesFromDB = async (chatKey) => {
    const db = await initDB();

    if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.error(`Object store '${STORE_NAME}' does not exist!`);
        return [];
    }

    const chat = await db.get(STORE_NAME, chatKey);
    return chat ? chat.messages : [];
};

// ✅ Delete all messages from IndexedDB
export const deleteAllChatsFromDB = async () => {
    console.log("call delete indexDB");

    const db = await initDB();

    if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.error(`Object store '${STORE_NAME}' does not exist!`);
        return;
    }

    await db.clear(STORE_NAME);
    console.log("All chats cleared.");

    // ✅ Reinitialize database after clearing
    await initDB();
};

// ✅ Delete chats from IndexedDB with verification
export const manageDeleteChatsInDB = async () => {
    const db = await initDB();

    if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.error(`Object store '${STORE_NAME}' does not exist!`);
        return;
    }

    // Step 1: Get all existing chat keys
    const allChatKeys = await db.getAllKeys(STORE_NAME);
    console.log("Existing Chat Keys Before Deletion:", allChatKeys);

    if (allChatKeys?.length === 0) {
        console.log("No chats found in IndexedDB.");
        return;
    }

    // Step 2: Delete all chats
    await db.clear(STORE_NAME);
    console.log("All chats deleted from IndexedDB.");

    // Step 3: Verify if deletion was successful
    const remainingChats = await db.getAllKeys(STORE_NAME);
    console.log("Chat Keys After Deletion:", remainingChats);
};

// ✅ Debugging function to check object store existence
export const checkObjectStores = async () => {
    const db = await initDB();
    console.log("Available object stores:", db.objectStoreNames);
};
