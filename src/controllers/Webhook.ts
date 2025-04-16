import logger from "@src/utils/logger";
import {HttpContext} from "@src/types/HttpContext";
import {verifyWebhook} from "@clerk/express/webhooks";
import {generateAccountId} from "@src/utils/generateUniqueAccountId";
import {UserService} from "@src/services/User";
import {safeUpdateMetadata} from "@src/utils/clerk/safeUpdateMetadata";
import {ensureUserExistsOnClerk} from "@src/utils/clerk/ensureUserExistsOnClerk";
import {AppError, generateEventId, isDuplicateEvent, markEventProcessed, Respond} from "@src/utils";

export class WebhookController {
    async user({req, res, next}: HttpContext) {
        try {
            const evt = await verifyWebhook(req);
            const eventId = generateEventId(evt);
            const { id: clerkId } = evt.data;

            if (await isDuplicateEvent(eventId)) {
                logger.warn(`Duplicate webhook event ignored: ${eventId}`, { label: 'Webhook' });
                return res.status(200).json({ status: 'ignored', message: 'Duplicate event.' });
            }

            if (evt.type === 'user.created' || evt.type === 'user.updated') {
                const exists = await ensureUserExistsOnClerk(clerkId);
                if (!exists) {
                    logger.warn(`User ${clerkId} doesn't exist on Clerk. Skipping.`, {label: 'Clerk Webhook'});
                    return res.status(200).json({ status: 'skipped' });
                }

                const role = evt.data.public_metadata?.role ?? 'member';
                const newAccountId = await generateAccountId();
                const accountId = evt.data.public_metadata?.accountId ?? newAccountId;

                const user =
                    evt.type === 'user.created'
                        ? await UserService.store(evt.data, (accountId as string).toLowerCase(), role as string)
                        : await UserService.update(evt.data, (accountId as string).toLowerCase(), role as string);

                await safeUpdateMetadata(clerkId, {accountId, role,}, {
                    _id: user._id.toString(),
                });

                await markEventProcessed(eventId, evt.type);

                logger.info(`User ${clerkId} ${evt.type === 'user.created' ? 'created' : 'updated'} successfully.`);

                return Respond(res, evt.data.id, `handled`);
            }

            if (evt.type === 'user.deleted') {
                await UserService.delete(clerkId);
                await markEventProcessed(eventId, evt.type);
                return Respond(res, clerkId, `as successfully deleted!`);
            }

            return res.status(200).json({
                status: 'ignored',
                message: `Event ${evt.type} not handled.`,
            });
        } catch (e) {
            logger.error(e.message ?? `Error verifying webhook: ${e}`, {label: 'Clerk Webhook'});
            return next(new AppError(e.message ?? 'Error verifying webhook', e.statusCode ?? 500));
        }
    }
}