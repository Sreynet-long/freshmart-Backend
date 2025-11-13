import { User } from "../../models/user.js";
import {
  ResponseMessage,
  ResponseMessageCustomizse,
  ResponseMessageWithData,
} from "../../function/responseMessage.js";
import { ApolloError } from "apollo-server-errors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Query } from "mongoose";
import { paginationLabel } from "../../function/paginateFn.js";

export const userResolvers = {
  Mutation: {
    // createUser: async (_, { input }, { req }) => {
    //   try {
    //     const isExist = await User.findOne({
    //       email: input.email,
    //     });
    //     if (isExist) {
    //       return ResponseMessageCustomizse(
    //         false,
    //         "ទិន្នន័យស្ទួន",
    //         "Already exist!"
    //       );
    //     }
    //     //create
    //     await new User(input).save();

    //     return ResponseMessage(true);
    //   } catch (error) {
    //     console.log(error);
    //     return ResponseMessageCustomizse(false, error.message, error.message);

    //   }
    // },
    signupUserForm: async (_, { input }) => {
      try {
        const { username, phoneNumber, email, password, checked, role } = input;

        const isExist = await User.findOne({ email });
        if (isExist) {
          // throw new ApolloError('The user already registered with the email ' + email, 'User already exists');
          return ResponseMessageCustomizse(
            false,
            "ទិន្នន័យស្ទួន",
            "The user already registered with the email " + email
          );
        }
        const encryptPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
          username: username,
          phoneNumber: phoneNumber,
          email: email,
          password: encryptPassword,
          checked: checked,
          role: role || "Customer",
        });

        const token = jwt.sign(
          { user_id: newUser._id, email: newUser.email },
          process.env.TOKEN_SECRET_KEY,
          { expiresIn: "1d" }
        );

        newUser.token = token;

        const createdUser = await newUser.save();
        console.log("createdUser", createdUser);

        return ResponseMessageWithData(true, newUser);
        // ResponseMessage(true);
      } catch (error) {
        console.error("sign up failed", error);
        // throw new ApolloError('Could not process signup request', 'SIGNUP_FAILED');
      }
    },
    loginUserForm: async (_, { input }) => {
      // Define a single, non-specific error for security
      // const INVALID_CREDENTIALS_ERROR = new ApolloError("Invalid email or password", "UNAUTHORIZED");

      try {
        const { email, password } = input;
        const user = await User.findOne({ email });

        // 1. Check if user exists AND AWAIT the password comparison
        if (user && (await bcrypt.compare(password, user.password))) {
          const token = jwt.sign(
            { user_id: user._id, email: user.email },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: "1d" }
          );

          user.token = token;
          await user.save();

          return ResponseMessageWithData(true, user);
        } else {
          // 2. Throw the generic error if user is null OR password is wrong
          return ResponseMessageCustomizse(
            false,
            "អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ",
            "Invalid email or password"
          );
        }
      } catch (error) {
        console.error("Sign up failed:", error);

        return ResponseMessageCustomizse(
          false,
          "មានបញ្ហាក្នុងការចុះឈ្មោះ",
          "Signup failed: " + error.message
        );
      }
    },

    resetPassword: async (_, { token, newPassword }) => {
      try {
        // 1️⃣ Verify token
        const payload = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        const user = await User.findOne({
          _id: payload.user_id,
          resetToken: token,
        });

        if (!user) {
          return ResponseMessageCustomizse(
            false,
            "តំណភ្ជាប់កំណត់ពាក្យសម្ងាត់មិនត្រឹមត្រូវ ឬផុតកំណត់",
            "Invalid or expired password reset link"
          );
        }

        if (user.resetTokenExpiry < Date.now()) {
          return ResponseMessageCustomizse(
            false,
            "តំណភ្ជាប់កំណត់ពាក្យសម្ងាត់ផុតកំណត់",
            "Password reset link expired"
          );
        }

        // 2️⃣ Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // 3️⃣ Clear token fields
        user.resetToken = null;
        user.resetTokenExpiry = null;

        await user.save();

        return ResponseMessageCustomizse(
          true,
          "កំណត់ពាក្យសម្ងាត់បានជោគជ័យ",
          "Password reset successful"
        );
      } catch (error) {
        console.error("Reset password error:", error);
        return ResponseMessageCustomizse(
          false,
          "មានបញ្ហាក្នុងការកំណត់ពាក្យសម្ងាត់",
          "Failed to reset password"
        );
      }
    },
    updateUser: async (_, { _id, input }) => {
      try {
        const { username, email, phoneNumber, checked } = input;

        const updated = await User.findByIdAndUpdate(
          _id,
          { username, email, phoneNumber, checked },
          { new: true }
        );

        if (!updated) {
          return {
            isSuccess: false,
            messageEn: "User not found",
            messageKh: "រកមិនឃើញអ្នកប្រើ",
          };
        }

        return {
          isSuccess: true,
          messageEn: "User updated successfully",
          messageKh: "ធ្វើបច្ចុប្បន្នភាពបានជោគជ័យ",
        };
      } catch (err) {
        console.error(err);
        return {
          isSuccess: false,
          messageEn: "Update failed",
          messageKh: "បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាព",
        };
      }
    },

    // ✅ Update user status (toggle active/inactive)
    updateUserStatus: async (_, { _id, checked }) => {
      try {
        const updated = await User.findByIdAndUpdate(
          _id,
          { checked },
          { new: true }
        );

        if (!updated) {
          return {
            isSuccess: false,
            messageEn: "User not found",
            messageKh: "រកមិនឃើញអ្នកប្រើ",
          };
        }

        return {
          isSuccess: true,
          messageEn: checked ? "User activated" : "User deactivated",
          messageKh: checked ? "បើកការប្រើប្រាស់វិញ" : "បិទការប្រើប្រាស់",
        };
      } catch (err) {
        console.error(err);
        return {
          isSuccess: false,
          messageEn: "Failed to update status",
          messageKh: "កំហុសក្នុងការធ្វើបច្ចុប្បន្នភាព",
        };
      }
    },

    // ✅ Delete user
    deleteUser: async (_, { _id }) => {
      try {
        const deleted = await User.findByIdAndDelete(_id);

        if (!deleted) {
          return {
            isSuccess: false,
            messageEn: "User not found",
            messageKh: "រកមិនឃើញអ្នកប្រើ",
          };
        }

        return {
          isSuccess: true,
          messageEn: "User deleted successfully",
          messageKh: "លុបបានជោគជ័យ",
        };
      } catch (err) {
        console.error(err);
        return {
          isSuccess: false,
          messageEn: "Delete failed",
          messageKh: "បរាជ័យក្នុងការលុប",
        };
      }
    },
  },
  Query: {
    getAdmins: async () => {
      try {
        return await User.find({ role: "Admin" });
      } catch (err) {
        console.error("Failed to fetch admins:", err);
        return [];
      }
    },
    getAllUsers: async () => {
      return await User.find();
    },
    getUserbyId: async (_, { _id }) => {
      return await User.findById(_id);
    },
    getUserWithPagination: async (_, { page, limit, pagination, keyword }) => {
      try {
        const options = {
          page: page || 1,
          limit: limit || 10,
          customLabels: paginationLabel,
          pagination: pagination,
        };
        const query = {
          username: { $regex: keyword, $options: "i" },
          role: "Customer",
        };
        const UserData = await User.paginate(query, options);
        return UserData;
      } catch (error) {}
    },
  },
};
