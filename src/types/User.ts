export interface User {
    _id: string;
    cId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    emailVerified: boolean;
    emailStrategy: string;
    phoneNumberVerified: boolean;
    phoneNumberStrategy: string;
    imageUrl: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}