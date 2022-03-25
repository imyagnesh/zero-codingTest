import Joi from 'joi';

class UserValidator {
  public static user() {
    return Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
  }
}

export default UserValidator;
