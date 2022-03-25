import Joi from 'joi';

class ProjectsValidator {
  public static projects() {
    return Joi.object({
      name: Joi.string().required(),
      private: Joi.boolean(),
      status: Joi.string().required().valid('Launching', 'In progress', 'Finished'),
      type: Joi.string().required().valid('Short Term Contract', 'Long Term Contract', 'Open Source'),
    });
  }

  public static addMembers() {
    return Joi.object({
      projectId: Joi.string().required(),
      members: Joi.array().items(Joi.string()).min(1),
    });
  }
}

export default ProjectsValidator;
