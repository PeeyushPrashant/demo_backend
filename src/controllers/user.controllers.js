import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details on FE
  //validation (not empty)
  // check if user already exists : username,email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object -> create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, userName, password } = req.body;
  console.log("REQUEST", email);

  if ([fullName, email, userName, password].some((el) => el?.trim() === "")) {
    throw new ApiError(400, "Some fields are empty");
  }

  const existedUser = User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(100, "Avatar file is required");
  }

  const avatarInDb = await uploadOnCloudinary(avatarLocalPath);
  const coverImageInDb = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatarInDb) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatarInDb.url,
    coverImage: coverImageInDb?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
