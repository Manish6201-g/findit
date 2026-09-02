import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User';
import Notification from '../models/Notification';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, (process.env.JWT_SECRET || 'secret') as jwt.Secret, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, rollNumber, department, year, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

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
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(String(user._id), user.role),
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password || ''))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(String(user._id), user.role),
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

export const getUserProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      return res.json({
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
      return res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error fetching profile' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide your account email' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No registered user found with this email' });
    }

    // Generate unhashed random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token to save in DB
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || 'https://findit-campus.vercel.app';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    // Create Notification
    await Notification.create({
      user: user._id,
      title: 'Password Reset Requested 🔐',
      message: `A password reset link was requested for your account.`,
      type: 'system',
    });

    return res.json({
      message: 'Password reset link generated successfully!',
      resetToken,
      resetUrl,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error processing forgot password request' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const tokenStr = String((req.params as any).token || '');
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Hash parameter token to match stored hash
    const hashedToken = crypto.createHash('sha256').update(tokenStr).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    (user as any).resetPasswordToken = undefined;
    (user as any).resetPasswordExpire = undefined;
    await user.save();

    return res.json({ message: 'Password has been reset successfully! You can now log in.' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error resetting password' });
  }
};
