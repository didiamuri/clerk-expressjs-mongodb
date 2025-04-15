import mongoose from "mongoose";
import {User} from "@src/types/User";

const schema = new mongoose.Schema<User>({
    cId: {type: String, required: true, index: true, unique: true},
    accountId: {type: String, required: true, index: true, unique: true},
    firstName: {type: String, required: true, index: true},
    lastName: {type: String, required: true, index: true},
    email: {type: String, required: true, index: true, unique: true},
    phoneNumber: {type: String, required: true, index: true, unique: true},
    role: {type: String, required: true, index: true},
    emailVerificationStatus: {type: String, required: true, default: 'verified'},
    emailVerificationStrategy: {type: String, required: true, default: 'ticket'},
    phoneNumberVerificationStatus: {type: String, required: true, default: 'verified'},
    phoneNumberVerificationStrategy: {type: String, required: true, default: 'phone_code'},
    imageUrl: {type: String, required: true},
    deleteSelfEnabled: {type: Boolean, default: false},
    createOrganizationEnabled: {type: Boolean, default: false},
    passwordEnabled: {type: Boolean, default: false},
    twoFactorEnabled: {type: Boolean, default: false},
    backupCodeEnabled: {type: Boolean, default: false},
    legalAcceptedAt: {type: Date, default: null},
    lastSignInAt: {type: Date, default: null},
    lastActiveAt: {type: Date, default: null},
    status: {type: String, required: true, enum: ['active', 'locked', 'banned', 'deleted'], default: 'active', index: true},
}, {
    timestamps: true
});

schema.index({createdAt: 1, updatedAt: 1});
schema.set("toJSON", { virtuals: false, versionKey: false });

export default mongoose.model<User>("User", schema);