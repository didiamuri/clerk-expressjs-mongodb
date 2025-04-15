import User from "@src/models/User";
import {UserJSON} from "@clerk/backend";
import logger from "@src/utils/logger";

export class UserService {
  static async store(data: UserJSON, accountId: string, role?: string) {
        try {
            const email = data.email_addresses[0]?.email_address;
            if (!email) throw new Error("Email is required");

            const mapped = this.mapper(data);
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                Object.assign(existingUser, {...mapped, accountId, role: role ?? mapped.role});
                await existingUser.save();
                logger.info(`User with email ${email} updated from Clerk`, { label: 'Clerk Webhook' });
                return existingUser;
            } else {
                const newUser = new User({...mapped, accountId, role: role ?? mapped.role, deleteSelfEnabled: false, createOrganizationEnabled: false});
                await newUser.save();
                logger.info(`New user created from Clerk`, { label: 'Clerk Webhook' });
                return newUser;
            }
        } catch (error) {
            logger.error(error.message ?? 'Error while to store user to MongoDb', {label: 'Clerk Webhook'});
            throw 'Error while to store user to MongoDb';
        }
    }

    static async update(data: UserJSON, accountId: string, role?: string) {
        try {
            const mapped = this.mapper(data);
            let user = await User.findOne({ cId: data.id });

            if (!user) {
                user = new User({...mapped, accountId, role: role ?? mapped.role, deleteSelfEnabled: false, createOrganizationEnabled: false});
                await user.save();
                logger.info(`User not found by Clerk ID; created instead`, { label: 'Clerk Webhook' });
            } else {
                Object.assign(user, {...mapped, accountId: accountId ?? user.accountId, role: role ?? user.role});
                await user.save();
                logger.info(`User updated from Clerk`, { label: 'Clerk Webhook' });
            }
            return user;
        } catch (e) {
            logger.error(e.message ?? 'Error while updating user in MongoDB', { label: 'Clerk Webhook' });
            throw new Error(`Error while updating user in MongoDB`);
        }
    }

    static async delete(id: string) {
        try {
            const user = await User.findOne({ cId: id });
            if (!user) throw new Error(`User with Clerk ID ${id} not found`);

            user.status = "deleted";
            await user.save();
            logger.info(`User ${id} marked as deleted`, { label: 'Clerk Webhook' });
            return user;
        } catch (error: any) {
            logger.error(error.message ?? 'Error while soft-deleting user in MongoDB', { label: 'Clerk Webhook' });
            throw new Error(`Error while soft-deleting user in MongoDB`);
        }
    }

    private static mapper(data: UserJSON) {
        const status = data.locked ? "locked" : data.banned ? "banned" : "active";
        return {
            cId: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email_addresses[0]?.email_address,
            phoneNumber: data.phone_numbers[0]?.phone_number,
            role: data.public_metadata?.role as string,
            emailVerificationStatus: data.email_addresses[0]?.verification.status,
            emailVerificationStrategy: data.email_addresses[0]?.verification.strategy,
            phoneNumberVerificationStatus: data.phone_numbers[0]?.verification.status,
            phoneNumberVerificationStrategy: data.phone_numbers[0]?.verification.strategy,
            imageUrl: data.image_url,
            passwordEnabled: data.password_enabled,
            twoFactorEnabled: data.two_factor_enabled,
            backupCodeEnabled: data.backup_code_enabled,
            legalAcceptedAt: data.legal_accepted_at !== null ? new Date(data.legal_accepted_at).getTime() : data.legal_accepted_at,
            lastActiveAt: data.last_active_at !== null ? new Date(data.last_active_at).toISOString() : data.last_active_at,
            lastSignInAt: data.last_sign_in_at !== null ? new Date(data.last_sign_in_at).toISOString() : data.last_sign_in_at,
            status,
        };
    }
}