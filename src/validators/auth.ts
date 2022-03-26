import Joi from 'joi';

class AuthValidator {
  public static login() {
    return Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
  }
}

export default AuthValidator;
