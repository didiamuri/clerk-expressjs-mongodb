import { Request, Response, NextFunction } from 'express';

export interface HttpContext {
    req: Request;
    res: Response;
    next: NextFunction;
}

export interface Business {
    _id: string;
    cId: string;
    name: string;
    slug: string;
    imageUrl?: string;
    membersCount?: number;
    pendingInvitationsCount?: number;
    maxAllowedMemberships: number;
    adminDeleteEnabled: boolean;
    addresses?: Address | null;
    created_by?: string;
    created_at: number;
    updated_at: number;
}

export interface Permission {
    _id?: string;
    cId: string;
    key: string;
    name: string;
    description: string;
    createdAt?: number;
    updatedAt?: number;
}

export interface Role {
    _id?: string;
    key: string;
    name: string;
    description: string;
    permissions: Array<Permission>;
    isCreatorEligible: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

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

export interface WebhookLog {
    _id: string;
    eventId: string;
    eventType: string;
    status: string;
    receivedAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

interface OrganizationPublicMetadata {
    [k: string]: unknown;
}

interface Address {
    [k: string]: unknown;
}