import { RequestHandler } from 'express';
import Joi from 'joi';
import ResponseWrapper from '../helpers/response_wrapper';

function validationMiddleware(Validator: Joi.ObjectSchema<any>): RequestHandler {
  return async (req, res, next) => {
    const response: ResponseWrapper = new ResponseWrapper(res);
    try {
      if (Validator) {
        await Validator.validateAsync(req.body);
      }
      return next();
    } catch (error) {
      return response.badRequest(error.details[0].message);
    }
  };
}

export default validationMiddleware;
