import { Router } from 'express';
import validationMiddleware from '../middleware/validation.middleware';
import UserController from '../controllers/userController';
import UserValidator from '../validators/user';
import AuthValidator from '../validators/auth';

class UserRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post('/register', validationMiddleware(UserValidator.user()), UserController.registerUser);
    this.router.post('/login', validationMiddleware(AuthValidator.login()), UserController.authenticateUser);
  }
}

export default UserRoutes;
