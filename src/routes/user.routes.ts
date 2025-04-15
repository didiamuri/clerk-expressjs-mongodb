import {Router} from 'express';
import {routeHandler} from "@src/utils/routeHandler";
import {UsersController} from '@src/controllers/UsersController'

const router = Router();
const usersController = new UsersController();

router.get('/', routeHandler(usersController, 'index'));
router.post('/', routeHandler(usersController, 'store'));
router.get('/:id', routeHandler(usersController, 'show'));
router.post('/webhook', routeHandler(usersController, 'webhook'));

export default {
    prefix: '/users',
    router,
};