import { Response } from 'express';

type ErrorResponse = {
  message: string;
};

type ISuccessHandleType = {
  data: any;
  success_code: number;
  fail_code?: never;
};

type IFailHandleType = {
  data: ErrorResponse;
  success_code?: never;
  fail_code: number;
};

type IHandleObject = ISuccessHandleType | IFailHandleType;

class ResponseWrapper {
  public res: Response;

  constructor(response: Response) {
    this.res = response;
  }

  public handle({ data, success_code, fail_code }: IHandleObject): Response {
    if (success_code) {
      return this.res.status(success_code).send({ success: true, data });
    }

    return this.res.status(fail_code).send({ success: false, error: data });
  }

  public created(data: object): Response {
    return this.handle({
      data,
      success_code: 201,
    });
  }

  public ok(data: object): Response {
    return this.handle({ data, success_code: 200 });
  }

  public badRequest(message?: string): Response {
    return this.handle({
      data: {
        message: message || '',
      },
      fail_code: 400,
    });
  }

  public unauthorized(message?: string): Response {
    return this.handle({
      data: {
        message: message || '',
      },
      fail_code: 401,
    });
  }

  public forbidden(message?: string): Response {
    return this.handle({
      data: {
        message: message || '',
      },
      fail_code: 403,
    });
  }

  public notFound(message?: string): Response {
    return this.handle({
      data: {
        message: message || '',
      },
      fail_code: 404,
    });
  }

  public unprocessableEntity(message?: string): Response {
    return this.handle({
      data: {
        message: message || 'Invalid Data',
      },
      fail_code: 422,
    });
  }

  public InternServerError(message?: string): Response {
    return this.handle({
      data: {
        message: message || 'Internal Server Error.',
      },
      fail_code: 500,
    });
  }
}

export default ResponseWrapper;
