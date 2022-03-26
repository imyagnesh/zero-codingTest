import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { JWTVerify } from '../util/auth';
import ResponseWrapper from '../helpers/response_wrapper';
import Projects from '../models/projects';
import { JWTType } from '../types/jwtType';

type SearchQueryType = {
  private: boolean;
  type?: string;
  status?: string;
  members?: Types.ObjectId;
};

const selectQuery = (decode: JWTType) => {
  const selectCond = (str: string) => ({
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
  return {
    private: 1,
    status: 1,
    name: selectCond('$name'),
    members: selectCond('$members'),
    type: selectCond('$type'),
  };
};

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
      const findParams: SearchQueryType[] = [];

      if (authorization) {
        JWTVerify(authorization, (err: Error, decoded: JWTType) => {
          if (err) {
            response.unauthorized('Invalid Token');
            return;
          }
          const authSearchQuery = { private: true };
          findParams.push(authSearchQuery);
          select = selectQuery(decoded);
        });
      }

      const { member, type, status } = req.query;
      const searchQuery: SearchQueryType = { private: false };
      if (member) {
        searchQuery.members = new Types.ObjectId(`${member}`);
      }
      if (type) {
        searchQuery.type = `${type}`;
      }
      if (status) {
        searchQuery.status = `${status}`;
      }

      findParams.push(searchQuery);

      const projects = await Projects.find({
        $or: findParams,
      }).select(select);
      return response.ok(projects);
    } catch (error) {
      return response.InternServerError();
    }
  };

  static getProject = async (req: Request, res: Response) => {
    const response: ResponseWrapper = new ResponseWrapper(res);
    try {
      let select = {};

      const { projectId } = req.params;
      const { authorization } = req.headers;

      const searchQuery = { _id: projectId, private: false };

      if (authorization) {
        JWTVerify(authorization, (err: Error, decoded: JWTType) => {
          if (err) {
            response.unauthorized('Invalid Token');
            return;
          }
          searchQuery.private = true;
          select = selectQuery(decoded);
        });
      }

      const project = await Projects.findOne(searchQuery).select(select);
      if (project) {
        return response.ok(project);
      }
      return response.notFound('Record Not Found');
    } catch (error) {
      return response.InternServerError();
    }
  };
}

export default ProjectsController;
