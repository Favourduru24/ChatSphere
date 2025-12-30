import cloudinary from "../config/cloudinary.config"
import UserModel from "../models/user.model"

export const findByIdUserService = async (userId: string) => {
    return await UserModel.findById(userId)
}

export const getUsersService = async (userId: string) => {
     const users = await UserModel.find({
        _id: {$ne: userId}
     }).select("-password")

     return users
}

export const updateUserProfileService = async (
  userId: string,
  body: { avatar: string }
) => {
  const user = await UserModel.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  if (body.avatar) {
    const uploadRes = await cloudinary.uploader.upload(body.avatar, {
      folder: "avatars",
      transformation: [{ width: 300, height: 300, crop: "fill" }],
    });

    user.avatar = uploadRes.secure_url;
  }

  await user.save();

  return user;
};
