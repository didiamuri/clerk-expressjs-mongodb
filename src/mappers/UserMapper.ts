import { UserJSON } from "@clerk/express";

export class UserMapper {
    static mapFromClerk(data: UserJSON, accountId: string, role: string) {
        const status = data.locked ? "locked" : data.banned ? "banned" : "active";
        return {
            cId: data.id,
            accountId: accountId,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email_addresses[0]?.email_address,
            phoneNumber: data.phone_numbers[0]?.phone_number,
            role: role ?? data.public_metadata?.role as string,
            emailVerificationStatus: data.email_addresses[0]?.verification?.status,
            emailVerificationStrategy: data.email_addresses[0]?.verification?.strategy,
            phoneNumberVerificationStatus: data.phone_numbers[0]?.verification?.status,
            phoneNumberVerificationStrategy: data.phone_numbers[0]?.verification?.strategy,
            imageUrl: data.image_url,
            deleteSelfEnabled: false,
            createOrganizationEnabled: false,
            passwordEnabled: data.password_enabled,
            twoFactorEnabled: data.two_factor_enabled,
            backupCodeEnabled: data.backup_code_enabled,
            legalAcceptedAt: data.legal_accepted_at ? new Date(data.legal_accepted_at).getTime() : null,
            lastActiveAt: data.last_active_at ? new Date(data.last_active_at).toISOString() : null,
            lastSignInAt: data.last_sign_in_at ? new Date(data.last_sign_in_at).toISOString() : null,
            status
        };
    }
}
