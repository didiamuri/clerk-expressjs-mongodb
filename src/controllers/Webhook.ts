import logger from "@src/utils/logger";
import {IHttpContext} from "@src/types";
import {verifyWebhook} from "@clerk/express/webhooks";
import {generateAccountId} from "@src/utils/generateUniqueAccountId";
import {UserService} from "@src/services/User";
import {safeUpdateMetadata} from "@src/utils/clerk/safeUpdateMetadata";
import {ensureUserExistsOnClerk} from "@src/utils/clerk/ensureUserExistsOnClerk";
import {AppError, generateEventId, isDuplicateEvent, markEventProcessed, Respond} from "@src/utils";
import * as process from "node:process";

export class WebhookController {
    async user({req, res, next}: IHttpContext) {
        try {
            const evt = await verifyWebhook(req);
            const eventId = generateEventId(evt);
            const { id: userId } = evt.data;

            if (await isDuplicateEvent(eventId)) {
                logger.warn(`Duplicate webhook event ignored: ${eventId}`, { label: 'Webhook' });
                return res.status(200).json({ status: 'ignored', message: 'Duplicate event.' });
            }

            if (evt.type === 'user.created' || evt.type === 'user.updated') {
                const exists = await ensureUserExistsOnClerk(userId);
                if (!exists) {
                    logger.warn(`User ${userId} doesn't exist on Clerk. Skipping.`, {label: 'Clerk Webhook'});
                    return res.status(200).json({ status: 'skipped' });
                }

                const role = evt.data.public_metadata?.role ?? 'member';
                const newAccountId = await generateAccountId();
                const accountId = evt.data.public_metadata?.accountId ?? newAccountId;

                const user =
                    evt.type === 'user.created'
                        ? await UserService.store(evt.data, (accountId as string).toLowerCase(), role as string)
                        : await UserService.update(evt.data, (accountId as string).toLowerCase(), role as string);

                await safeUpdateMetadata(userId, {accountId, role,}, {
                    _id: user._id.toString(),
                });

                await markEventProcessed(eventId, evt.type);

                logger.info(`User ${userId} ${evt.type === 'user.created' ? 'created' : 'updated'} successfully.`);

                return Respond(res, evt.data.id, `handled`);
            }

            if (evt.type === 'user.deleted') {
                await UserService.delete(userId);
                await markEventProcessed(eventId, evt.type);
                return Respond(res, userId, `as successfully deleted!`);
            }

            return res.status(200).json({
                status: 'ignored',
                message: `Event ${evt.type} not handled.`,
            });
        } catch (e) {
            logger.error(e.message ?? `Error verifying webhook: ${e}`, {label: 'Clerk Webhook - User'});
            return next(new AppError(e.message ?? 'Error verifying webhook', e.statusCode ?? 500));
        }
    }

    async role({req, res, next}: IHttpContext) {
        try {
            const evt = await verifyWebhook(req, {
                signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET_ROLE
            });
            const eventId = generateEventId(evt);
            const { id: clerkId } = evt.data;

            if (await isDuplicateEvent(eventId)) {
                logger.warn(`Duplicate webhook event ignored: ${eventId}`, { label: 'Webhook' });
                return res.status(200).json({ status: 'ignored', message: 'Duplicate event.' });
            }

            if (evt.type === 'role.created' || evt.type === 'role.updated') {
                    const data = evt.data;
            }

        } catch (e) {
            logger.error(e.message ?? `Error verifying webhook: ${e}`, {label: 'Clerk Webhook - Role'});
            return next(new AppError(e.message ?? 'Error verifying webhook', e.statusCode ?? 500));
        }
    }
}