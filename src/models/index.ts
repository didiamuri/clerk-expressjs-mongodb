import Role from "./Role";
import User from "./User";
import WebhookLog from "./WebhookLog";

export const initCollections = async () => {
    await Promise.all([
        Role.createCollection(),
        User.createCollection(),
    ]);
};

export {
    Role,
    User,
    WebhookLog
};