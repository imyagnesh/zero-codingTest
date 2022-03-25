import { Document, Schema, model, Types } from 'mongoose';

enum ProjectStatusEnum {
  Launching = 'Launching',
  InProgress = 'In progress',
  Finished = 'Finished',
}

enum ProjectTypeEnum {
  ShortTerm = 'Short Term Contract',
  LongTerm = 'Long Term Contract',
  OpenSource = 'Open Source',
}

interface ProjectsType extends Document {
  name: string;
  private: boolean;
  status: ProjectStatusEnum;
  type: ProjectTypeEnum;
  members: Types.ObjectId[];
}

const ProjectsSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      index: true,
    },
    private: {
      type: Boolean,
      default: false,
    },
    status: String,
    type: String,
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    toJSON: {
      versionKey: false,
    },
  },
);

export default model<ProjectsType>('Projects', ProjectsSchema);
