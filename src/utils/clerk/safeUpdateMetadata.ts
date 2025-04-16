import {isDeepStrictEqual} from 'node:util';
import {clerkClient} from '@clerk/express';

/**
 * Updates Clerk metadata only if it has changed.
 *
 * @param userId Clerk user ID
 * @param newPublicMetadata New public metadata
 * @param newPrivateMetadata New private metadata
 * @returns true if an update has been performed, otherwise false
 */
export async function safeUpdateMetadata(userId: string, newPublicMetadata: Record<string, any>, newPrivateMetadata: Record<string, any>): Promise<boolean> {
    const user = await clerkClient.users.getUser(userId);

    const currentPublic = user.publicMetadata || {};
    const currentPrivate = user.privateMetadata || {};

    const hasPublicChanged = !isDeepStrictEqual(currentPublic, newPublicMetadata);
    const hasPrivateChanged = !isDeepStrictEqual(currentPrivate, newPrivateMetadata);

    if (!hasPublicChanged && !hasPrivateChanged) {
        return false;
    }

    await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: newPublicMetadata,
        privateMetadata: newPrivateMetadata,
    });

    return true;
}
