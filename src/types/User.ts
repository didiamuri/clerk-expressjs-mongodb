export interface User {
    _id: string;
    cId: string;
    accountId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    emailVerificationStatus: string;
    emailVerificationStrategy: string;
    phoneNumberVerificationStatus: string;
    phoneNumberVerificationStrategy: string;
    imageUrl: string;
    deleteSelfEnabled: boolean;
    createOrganizationEnabled: boolean;
    passwordEnabled: boolean;
    twoFactorEnabled: boolean;
    backupCodeEnabled: boolean;
    legalAcceptedAt: Date;
    lastActiveAt: Date;
    lastSignInAt: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}