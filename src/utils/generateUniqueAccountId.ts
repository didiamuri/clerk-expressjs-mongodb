import { customAlphabet } from 'nanoid';
import User from "@src/models/User";

const generateId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10);

export async function generateAccountId(): Promise<string> {
    const maxAttempts = 10;
    for (let i = 0; i < maxAttempts; i++) {
        const accountId = generateId().toString();
        const exists = await User.exists({ accountId });
        if (!exists) return accountId;
    }
    throw new Error("Failed to generate a unique account ID after several attempts.");
}