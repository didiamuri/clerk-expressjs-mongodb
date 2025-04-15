import Role from "@src/models/Role";
import User from "@src/models/User";

export const initCollections = async () => {
    await Promise.all([
        Role.createCollection(),
        User.createCollection(),
    ]);
};

export default {
    Role,
    User
};