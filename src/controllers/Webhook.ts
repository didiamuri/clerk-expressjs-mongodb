import logger from "@src/utils/logger";
import {AppError} from "@src/utils";
import {HttpContext} from "@src/types/HttpContext";
import {verifyWebhook} from "@clerk/express/webhooks";
import {clerkClient} from "@clerk/express";
import {generateAccountId} from "@src/utils/generateUniqueAccountId";
import {UserService} from "@src/services/User";

export class WebhookController {
    async index({req, res, next}: HttpContext) {
        try {
            const evt = await verifyWebhook(req);
            const {id} = evt.data;

            if (evt.type === 'user.created') {

                const initialRole = 'member';
                const accountId = await generateAccountId();

                await UserService.store(evt.data, accountId, initialRole);

                await clerkClient.users.updateUserMetadata(evt.data.id, {
                    publicMetadata: {
                        accountId: accountId,
                        role: initialRole
                    }
                });

                logger.info(`\`User successfully stored to mongodb (cId) : ${id}`, {label: 'Clerk Webhook'});

                return res.status(200).json({
                    status: 'success',
                    message: 'Webhook received successfully.',
                });
            }
        } catch (e) {
            logger.error(e.message ?? `Error verifying webhook: ${e}`, {label: 'Clerk Webhook'});
            return next(new AppError(e.message ?? 'Error verifying webhook', e.statusCode ?? 500));
        }
    }
}