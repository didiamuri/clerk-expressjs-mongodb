import express from 'express';
import {routeHandler} from "@src/utils/routeHandler";
import {WebhookController} from "@src/controllers/Webhook";

const router = express.Router();
const webhookController = new WebhookController();

router.post('/clerk/user', express.raw({type: 'application/json'}), routeHandler(webhookController, 'user'));

export default {
    prefix: '/webhooks',
    router,
};