import { Request, Response, NextFunction } from 'express';

export interface IBusiness {
    _id: string;
    cId: string;
    name: string;
    slug: string;
    imageUrl?: string;
    membersCount?: number;
    pendingInvitationsCount?: number;
    maxAllowedMemberships: number;
    adminDeleteEnabled: boolean;
    status: string;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IBusinessDomain {
    _id: string;
    cId: string;
    name: string;
    businessId: string;
    enrollmentMode: TBusinessEnrollmentMode;
    verification: IBusinessDomainVerification | null;
    affiliation_email_address: string | null;
    created_at: number;
    updated_at: number;
    total_pending_invitations: number;
    total_pending_suggestions: number;
}

export interface IBusinessDomainVerification {
    status: TBusinessDomainVerificationStatus;
    strategy: TBusinessDomainVerificationStrategy;
    attempts: number;
    expiresAt: Date
}

export interface IBusinessInvitation {
    _id: string;
    cId: string;
    email: string;
    role: string;
    roleName: string;
    businessId: string;
    url: string | null;
    status: TBusinessInvitationStatus;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
}

export interface IBusinessMembership {
    _id: string;
    cId: string;
    role: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
    business: IBusiness;
    publicUserData: IBusinessMembershipPublicUserData;
}

export interface IBusinessMembershipPublicUserData {
    identifier: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string;
    userId: string;
}

export interface IHttpContext {
    req: Request;
    res: Response;
    next: NextFunction;
}

export interface IPermission {
    _id?: string;
    cId: string;
    key: string;
    name: string;
    description: string;
    createdAt?: number;
    updatedAt?: number;
}

export interface IRole {
    _id?: string;
    key: string;
    name: string;
    description: string;
    permissions: Array<IPermission>;
    isCreatorEligible: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISessionActivity {
    _id: string;
    cId: string;
    device?: string;
    isMobile: boolean;
    browserName?: string;
    browserVersion?: string;
    ipAddress?: string;
    city?: string;
    country?: string;
}
export interface ISession {
    _id: string;
    cId: string;
    clientId: string;
    userId: string;
    status: string;
    lastActiveBusinessId?: string;
    actor: Record<string, unknown> | null;
    latestActivity?: ISessionActivity;
    lastActiveAt: number;
    expireAt: Date;
    abandonAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUser {
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
    status: TUserStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface IWebhookLog {
    _id: string;
    eventId: string;
    eventType: string;
    status: string;
    receivedAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrganizationPublicMetadata {
    [k: string]: unknown;
}

export interface Address {
    [k: string]: unknown;
}

export type TBusinessInvitationStatus = 'pending' | 'accepted' | 'revoked';
export type TBusinessEnrollmentMode = 'manual_invitation' | 'automatic_invitation' | 'automatic_suggestion';
export type TBusinessDomainVerificationStatus = 'unverified' | 'verified';
export type TBusinessDomainVerificationStrategy = 'email_code';
export type TUserStatus = 'active' | 'locked' | 'banned' | 'deleted';