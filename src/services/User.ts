import logger from "@src/utils/logger";
import {User} from "@src/models";
import {UserJSON} from "@clerk/express";
import {UserMapper} from "@src/mappers/UserMapper";

export class UserService {
    static async store(data: UserJSON, accountId: string, role: string) {
        try {
            // Check if user with this email already exists
            const existingUser = await User.findOne({email: data.email_addresses[0]?.email_address});

            const userData = UserMapper.mapFromClerk(data, accountId, role);

            if (existingUser) {
                logger.info(`User [${existingUser._id.toString()}] updated instead of created (email already existed)`);
                return await User.findOneAndUpdate(
                    {email: existingUser.email},
                    {...userData, status: 'active'},
                    {new: true}
                );
            }

            const newUser = new User(userData);
            logger.info(`New user [${newUser._id.toString()}] created with Clerk ID: ${newUser.cId}`);
            return await newUser.save();
        } catch (error) {
            logger.error(error?.message ?? 'Error while storing user to MongoDB', {label: 'UserService'});
            throw new Error('Failed to store user to MongoDB');
        }
    }

    static async update(data: UserJSON, accountId: string, role: string) {
        try {
            const userData = UserMapper.mapFromClerk(data, accountId, role);

            const updatedUser = await User.findOneAndUpdate(
                {cId: data.id},
                {$set: userData},
                {upsert: true, new: true}
            );

            logger.info(`User [${updatedUser._id.toString()}] updated with Clerk ID: ${data.id}`);

            return updatedUser;
        } catch (error) {
            logger.error(error?.message ?? 'Error while updating user in MongoDB', {label: 'UserService'});
            throw new Error('Failed to update user in MongoDB');
        }
    }

    static async delete(clerkId: string) {
        try {
            const deletedUser = await User.findOneAndUpdate(
                {cId: clerkId},
                {$set: {status: 'deleted', deletedAt: new Date()}},
                {new: true}
            );

            if (!deletedUser) {
                logger.warn(`User with Clerk ID: ${clerkId} not found for deletion.`);
                return null;
            }

            logger.info(`User [${deletedUser._id}] marked as deleted.`);
            return deletedUser;
        } catch (error) {
            logger.error(error?.message ?? 'Error while deleting user', {label: 'UserService'});
            throw new Error('Failed to delete user from MongoDB');
        }
    }
}
