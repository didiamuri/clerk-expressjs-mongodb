import {HttpContext} from "@src/types/HttpContext";
import {clerkClient} from '@clerk/express'

export class UsersController {
    async index({res}: HttpContext) {

        const users = await clerkClient.users.getUserList();

        return res.status(200).json(users);
    }

    async store({res}: HttpContext) {
        return res.status(200).json({
            message: 'Welcome to Clerk!',
        })
    }

    async show({res}: HttpContext) {
        return res.status(200).json({
            message: 'Welcome to Clerk!',
        })
    }
}