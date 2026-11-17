const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthService {
  static getRefreshSecret() {
    return (
      process.env.JWT_REFRESH_SECRET ||
      `${process.env.JWT_SECRET || 'javapack_super_secret_jwt_key_change_in_production'}_refresh`
    );
  }

  static generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'javapack_super_secret_jwt_key_change_in_production',
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
  }

  static generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id, type: 'refresh' },
      this.getRefreshSecret(),
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
  }

  static async register({ name, email, password, phone }) {
    const normalizedPhone = String(phone).trim();

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error('Email is already registered');
      error.statusCode = 400;
      throw error;
    }

    const existingPhone = await User.findOne({ where: { phone: normalizedPhone } });
    if (existingPhone) {
      const error = new Error('Phone number is already registered');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: normalizedPhone,
      role: 'customer'
    });

    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { user, token, refreshToken };
  }

  static async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    await user.update({ last_login_at: new Date() });

    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { user, token, refreshToken };
  }

  static async refreshToken(refreshToken) {
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, this.getRefreshSecret());
    } catch {
      const error = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      throw error;
    }

    if (decoded.type !== 'refresh') {
      const error = new Error('Invalid refresh token type');
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user);
    const newRefreshToken = this.generateRefreshToken(user);
    return { token, refreshToken: newRefreshToken };
  }

  static async getProfile(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  static async updateProfile(userId, { name, phone }) {
    const user = await this.getProfile(userId);
    let nextPhone = user.phone;

    if (phone !== undefined) {
      const normalizedPhone = String(phone).trim();
      if (!normalizedPhone) {
        const error = new Error('Phone number cannot be empty');
        error.statusCode = 400;
        throw error;
      }

      if (normalizedPhone !== user.phone) {
        const existingPhone = await User.findOne({ where: { phone: normalizedPhone } });
        if (existingPhone && existingPhone.id !== userId) {
          const error = new Error('Phone number is already registered');
          error.statusCode = 400;
          throw error;
        }
      }
      nextPhone = normalizedPhone;
    }

    await user.update({
      name: name !== undefined ? name : user.name,
      phone: nextPhone
    });
    return user;
  }
}

module.exports = AuthService;
