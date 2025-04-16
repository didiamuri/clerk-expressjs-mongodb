import {clerkClient} from "@clerk/express";

export async function ensureUserExistsOnClerk(clerkId: string): Promise<boolean> {
    try {
        const user = await clerkClient.users.getUser(clerkId);
        return !!user;
    } catch (err: any) {
        if (err.errors?.[0]?.code === 'resource_not_found') return false;
        throw err;
    }
}
