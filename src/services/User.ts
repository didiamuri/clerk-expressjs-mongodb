import User from "@src/models/User";
import {UserJSON} from "@clerk/backend";
import logger from "@src/utils/logger";

export class UserService {
  static async store(data: UserJSON, accountId: string, role?: string) {
        try {
            const status = data.locked ? "locked" : data.banned ? "banned" : "active";
            const newUser = new User({
                cId: data.id,
                accountId: accountId,
                firstName: data.first_name,
                lastName: data.last_name,
                email: data.email_addresses[0].email_address,
                phoneNumber: data.phone_numbers[0].phone_number,
                role: role ?? data.public_metadata.role as string,
                emailVerificationStatus: data.email_addresses[0].verification.status,
                emailVerificationStrategy: data.email_addresses[0].verification.strategy,
                phoneNumberVerificationStatus: data.phone_numbers[0].verification.status,
                phoneNumberVerificationStrategy: data.phone_numbers[0].verification.strategy,
                imageUrl: data.image_url,
                deleteSelfEnabled: false,
                createOrganizationEnabled: false,
                passwordEnabled: data.password_enabled,
                twoFactorEnabled: data.two_factor_enabled,
                backupCodeEnabled: data.backup_code_enabled,
                legalAcceptedAt: new Date(data.legal_accepted_at),
                lastActiveAt: new Date(data.last_active_at),
                lastSignInAt: new Date(data.last_sign_in_at),
                status: status
            });

           return await newUser.save();
        } catch (error) {
            logger.error(error.message ?? 'Error while to store user to MongoDb', {label: 'Clerk Webhook'});
            throw 'Error while to store user to MongoDb';
        }
    }
}