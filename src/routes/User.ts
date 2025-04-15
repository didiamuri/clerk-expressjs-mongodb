import express from 'express';
import {bodyParser} from "@src/middlewares";
import {routeHandler} from "@src/utils/routeHandler";
import {UserController} from '@src/controllers/User'

const router = express.Router();
const usersController = new UserController();

router.get('/', ...bodyParser, routeHandler(usersController, 'index'));
router.post('/', ...bodyParser, routeHandler(usersController, 'store'));
router.get('/:id', ...bodyParser, routeHandler(usersController, 'show'));

export default {
    prefix: '/users',
    router,
};