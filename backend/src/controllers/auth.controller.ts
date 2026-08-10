import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, rollNumber, department, year, phone } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Note: Password hashing should ideally be a pre-save hook in the model, 
  // but I'll add it here for now if the model doesn't have it.
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    rollNumber,
    department,
    year,
    phone,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id as string, user.role),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // @ts-ignore - password is not in IUser interface yet but is in DB
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id as string, user.role),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
};

export const getUserProfile = async (req: any, res: Response) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      department: user.department,
      year: user.year,
      phone: user.phone,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};
