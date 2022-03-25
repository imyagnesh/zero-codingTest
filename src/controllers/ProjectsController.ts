import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import ResponseWrapper from '../helpers/response_wrapper';
import Projects from '../models/projects';
import { JWT_SECRET } from '../util/secrets';

class ProjectsController {
  static createProject = async (req: Request, res: Response) => {
    const response: ResponseWrapper = new ResponseWrapper(res);
    try {
      const isProjectExists = await Projects.findOne({ name: req.body.name }).exec();

      if (isProjectExists) return response.unauthorized('Project Name already exist');

      const data = await Projects.create({ ...req.body, members: [req.body.userId] });

      return response.created(data);
    } catch (error) {
      return response.InternServerError();
    }
  };

  static addMember = async (req: Request, res: Response) => {
    const response: ResponseWrapper = new ResponseWrapper(res);
    try {
      const project = await Projects.findOne({ _id: req.body.projectId }).exec();
      project.members.push(...req.body.members);
      project.save();
      return response.created(project);
    } catch (error) {
      return response.InternServerError();
    }
  };

  static getProjects = async (req: Request, res: Response) => {
    const response: ResponseWrapper = new ResponseWrapper(res);
    try {
      const { authorization } = req.headers;
      let select = {};
      let decode = {};
      const findParams = [];

      if (authorization) {
        const token = authorization.replace(/bearer /i, '');

        decode = jwt.verify(token, JWT_SECRET);

        if (decode) {
          const authQuery = { private: true };
          findParams.push(authQuery);
          const selectCond = (str) => ({
            $cond: [
              {
                $or: [
                  { $eq: ['$private', false] },
                  {
                    $in: [new Types.ObjectId(`${decode.id}`), '$members'],
                  },
                ],
              },
              str,
              null,
            ],
          });
          select = {
            private: 1,
            status: 1,
            name: selectCond('$name'),
            members: selectCond('$members'),
            type: selectCond('$type'),
          };
        }
      }

      const { member, type, status } = req.query;
      const query = { private: false };
      if (member) {
        query.members = new Types.ObjectId(`${member}`);
      }
      if (type) {
        query.type = type;
      }
      if (status) {
        query.status = status;
      }

      findParams.push(query);

      const projects = await Projects.find({
        $or: findParams,
      }).select(select);
      return response.ok(projects);
    } catch (error) {
      return response.InternServerError();
    }
  };
}

export default ProjectsController;
