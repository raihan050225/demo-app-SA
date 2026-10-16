const mongoose = require("mongoose");
const User = require("../models/user.model");
const UserProfile = require("../models/user.profile.model");
const bcrypt = require("bcryptjs");
const tokenService = require("../jwt/token.service");

class UserService {
  async getAllUsers() {
    return await User.find({ isActive: true });
  }

  async getUserById(id) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }
    const userData = await User.findById(id);
    const ProfileData = await UserProfile.findOne({ user: id });

    return { userData, ProfileData };
  }

  async createUser({ name, email }) {
    return await User.create({ name, email });
  }

  async userSignup({ name, email, password }) {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    return await User.create({ name, email, password: hashedPassword });
  }

  async updateUser(id, { name, email }) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }
    return await User.findByIdAndUpdate(
      id,
      { name, email },
      { returnDocument: "after", runValidators: true },
    );
  }

  async softDelete(id) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }
    return await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { returnDocument: "after", runValidators: true },
    );
  }

  async patchUser(id, updates) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }
    return await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { returnDocument: "after", runValidators: true },
    );
  }

  async deleteUser(id) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }
    return await User.findByIdAndDelete(id);
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const payload = {
      id: user._id,
      email: user.email,
      isActive: user.isActive,
    };
    const token = tokenService.generateToken(payload);
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    return { user: userWithoutPassword, token };
  }

  async addUserProfile(userId, profileData) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new Error("Invalid user ID");
    }

    const userProfile = await UserProfile.create({
      user: userId,
      age: profileData.age,
      dob: profileData.dob,
      bio: profileData.bio,
    });
    return userProfile;
  }
}

module.exports = new UserService();
