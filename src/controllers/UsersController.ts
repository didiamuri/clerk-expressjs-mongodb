import logger from "@src/utils/logger";
import {Webhook} from 'svix';
import {AppError} from "@src/utils";
import {clerkClient} from '@clerk/express';
import {createClerkClient, WebhookEvent} from '@clerk/backend';
import {HttpContext} from "@src/types/HttpContext";


const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
const clerk = createClerkClient({secretKey: process.env.CLERK_SECRET_KEY});

export class UsersController {
    async index({res}: HttpContext) {

        const users = await clerkClient.users.getUserList();

        return res.status(200).json(users);
    }

    async store({res}: HttpContext) {
        return res.status(200).json({
            message: 'Welcome to Clerk!',
        })
    }

    async show({res}: HttpContext) {
        return res.status(200).json({
            message: 'Welcome to Clerk!',
        })
    }

    async webhook({req, res, next}: HttpContext) {
        const payload = req.body.toString();
        const svix_id = req.headers['svix-id'];
        const svix_timestamp = req.headers['svix-timestamp'];
        const svix_signature = req.headers['svix-signature'];

        if (!svix_id || !svix_timestamp || !svix_signature) {
            return res.status(400).send('Missing Svix Headers');
        }

        const wh = new Webhook(WEBHOOK_SECRET);

        let evt: WebhookEvent;

        try {
            evt = wh.verify(payload, {
                id: svix_id as string,
                timestamp: svix_timestamp as string,
                signature: svix_signature as string
            }) as any;
        } catch (e) {
            logger.error(e.message ?? 'Webhook Verification Failed', {label: 'Webhook'});
            return next(new AppError(e.message ?? 'Webhook Verification Failed', 400));
        }

        if (evt.type === 'user.created') {
            const { id } = evt.data;
            const initialRole = 'user';

            try {
                const updatedUser = await clerk.users.updateUser(id, {
                    publicMetadata: {
                        role: initialRole
                    },
                });
                logger.info(`Metadata added to user: ${updatedUser.id}`, {label: 'Webhook'});
                return res.status(200).json({
                    success: true
                });
            } catch (e) {
                logger.error(e.message ?? `Error during user update: ${e}`, {label: 'Webhook'});
                return next(new AppError(e.message ?? 'Failed to update user metadata', e.statusCode ?? 500));
            }
        } else {
           return res.json({ success: true });
        }
    }
}