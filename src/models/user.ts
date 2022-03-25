import { Document, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import { JWT_SECRET } from '../util/secrets';

interface EncryptPassword {
  (encryptPassword: string): Promise<string>;
}
interface Authenticate {
  (plainTextPassword: string): Promise<boolean>;
}

interface GenerateToken {
  (): string;
}

interface UserType extends Document {
  name: string;
  password: string;
  encryptPassword: EncryptPassword;
  authenticate: Authenticate;
  generateToken: GenerateToken;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      index: true,
    },
    password: {
      type: String,
    },
  },
  {
    toJSON: {
      transform: (doc, ret: UserType) => {
        const { password, ...rest } = ret;
        return rest;
      },
      versionKey: false,
    },
  },
);

UserSchema.pre<UserType>('save', async function encrypt(next) {
  if (this.isModified('password')) {
    const hash = await this.encryptPassword(this.password);
    this.password = hash;
  }
  return next();
});

UserSchema.methods = {
  async authenticate(plainTextPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainTextPassword, this.password);
    } catch (err) {
      return false;
    }
  },
  encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, bcrypt.genSaltSync(config.salt));
  },
  generateToken(): string {
    return jwt.sign(
      {
        name: this.name,
        email: this.email,
        // eslint-disable-next-line no-underscore-dangle
        id: this._id,
      },
      JWT_SECRET,
      {
        expiresIn: 24 * 60 * 60,
      },
    );
  },
};

export default model<UserType>('User', UserSchema);
