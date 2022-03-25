import Joi from 'joi';

class AuthValidator {
  public static login() {
    return Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
  }

  public static whoami() {
    return Joi.object({});
  }
}

export default AuthValidator;
