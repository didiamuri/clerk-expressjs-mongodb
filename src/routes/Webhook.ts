import express from 'express';
import {routeHandler} from "@src/utils/routeHandler";
import {WebhookController} from "@src/controllers/Webhook";

const router = express.Router();
const webhookController = new WebhookController();

router.post('/users', express.raw({type: 'application/json'}), routeHandler(webhookController, 'index'));

export default {
    prefix: '/webhooks',
    router,
};