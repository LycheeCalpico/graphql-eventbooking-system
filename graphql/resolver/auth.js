import User from "../../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default {
  createUser: async (args) => {
    try {
      const user = await User.findOne({ email: args.userInput.email });
      if (user) {
        throw new Error("User Exists Already");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      const res = await newUser.save();
      return { ...res._doc, password: null };
    } catch (error) {
      throw error;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("User doesn't exist");
      }
      const isEqual = bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Password isn't correct");
      }
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        "secretOrPrivateKey",
        { expiresIn: "1h" }
      );
      return { userId: user._id, token: token, tokenExpiration: 1 };
    } catch (error) {
      throw error;
    }
  },
};
