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
                const newUser =  await UserService.store(evt.data, accountId.toLowerCase(), initialRole);

                await clerkClient.users.updateUserMetadata(evt.data.id, {
                    publicMetadata: {
                        accountId: accountId,
                        role: initialRole
                    },
                    privateMetadata: {
                        _id: newUser._id.toString(),
                    }
                });

                return res.status(200).json({
                    status: 'success',
                    message: 'Webhook received successfully.',
                });
            }
            if (evt.type === 'user.updated') {
                const role = evt.data.public_metadata?.role ?? 'member';
                const newAccountId = await generateAccountId();
                const accountId = evt.data.public_metadata?.accountId ?? newAccountId.toString();

                const user = await UserService.update(evt.data, accountId as string, role as string);

                const clerkUser = await clerkClient.users.getUser(evt.data.id);

                const currentPublic = clerkUser.publicMetadata || {};
                const currentPrivate = clerkUser.privateMetadata || {};

                if (currentPublic.accountId !== accountId || currentPublic.role !== role || currentPrivate._id !== user._id.toString()) {
                    await clerkClient.users.updateUserMetadata(evt.data.id, {
                        publicMetadata: {
                            accountId: accountId,
                            role: role
                        },
                        privateMetadata: {
                            _id: user._id.toString(),
                        }
                    });
                }
                return res.status(200).json({
                    status: 'success',
                    message: 'Webhook received successfully.',
                });
            }
            return res.status(200).json({
                status: 'success',
                message: 'Webhook received successfully.',
            });
        } catch (e) {
            logger.error(e.message ?? `Error verifying webhook: ${e}`, {label: 'Clerk Webhook'});
            return next(new AppError(e.message ?? 'Error verifying webhook', e.statusCode ?? 500));
        }
    }
}