import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  refreshTokens: { token: string; createdAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  addRefreshToken(token: string): Promise<void>;
  removeRefreshToken(token: string): Promise<void>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 2592000 // 30 days in seconds
    }
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate access token (expires in 10 hours)
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { 
      userId: this._id, 
      username: this.username, 
      email: this.email 
    },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: '10h' }
  );
};

// Generate refresh token (expires in 30 days)
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { userId: this._id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '30d' }
  );
};

// Add refresh token to user
userSchema.methods.addRefreshToken = async function (token: string) {
  this.refreshTokens.push({ token });
  await this.save();
};

// Remove refresh token from user
userSchema.methods.removeRefreshToken = async function (token: string) {
  this.refreshTokens = this.refreshTokens.filter(
    (tokenObj: any) => tokenObj.token !== token
  );
  await this.save();
};

export const User = mongoose.model<IUser>('User', userSchema); 