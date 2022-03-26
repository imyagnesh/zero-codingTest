import { Router } from 'express';
import validationMiddleware from 'src/middleware/validation.middleware';
import ProjectsController from 'src/controllers/projectsController';
import ProjectsValidator from 'src/validators/projects';
import verifyToken from '../middleware/auth.middleware';

class ProjectsRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get('/', ProjectsController.getProjects);
    this.router.get('/:projectId', ProjectsController.getProject);
    this.router.post(
      '/',
      [validationMiddleware(ProjectsValidator.projects()), verifyToken],
      ProjectsController.createProject,
    );
    this.router.post(
      '/addMembers',
      [validationMiddleware(ProjectsValidator.addMembers()), verifyToken],
      ProjectsController.addMember,
    );
  }
}

export default ProjectsRoutes;
