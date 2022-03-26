import { Request, Response } from 'express';
import ResponseWrapper from '../helpers/response_wrapper';
import User from '../models/user';

class UserController {
  static async registerUser(req: Request, res: Response) {
    const response: ResponseWrapper = new ResponseWrapper(res);
    try {
      const { email, name, password } = req.body;
      const isUserExists = await User.findOne({ email }).exec();

      if (isUserExists) return response.unauthorized('User already exist');

      const user = await User.create({
        email,
        name,
        password,
      });

      return response.created({ accessToken: user.generateToken(), user });
    } catch (error) {
      console.log(error);

      return response.InternServerError();
    }
  }

  static async authenticateUser(req: Request, res: Response) {
    const response: ResponseWrapper = new ResponseWrapper(res);
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        email,
      });
      if (!user) return response.unauthorized('email not available');

      const authenticateUser = await user.authenticate(password);

      if (!authenticateUser) return response.unauthorized('Invalid password');

      return response.created({ accessToken: user.generateToken(), user });
    } catch (error) {
      return response.InternServerError();
    }
  }
}

export default UserController;
