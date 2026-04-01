import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens = async(userId)
  try {
  const user = await User.findById(userId)
 const accesstoken = user.generateAccessTokens
  const refersh = user.generateRefreshTokens

  User.refershToken = refershToken
  await User.save({validateBeforeSave: false})

return {accesstoken, refershToken}


  } catch (error) {
    throw new ApiError(500, "something went worrng while generating refersh and access and token")
  }


const reqisterUser = asyncHandler( async (req, res) => {


   // get user deatails from  fronted
   // validation - not empty
   // check if user already exists: username, email
   // check for images, check for avater
   // upload them to cloudinary, avatar
   //  create user onject - create entry in db
   // remove password and refresh token filed from resonse
   // check res

   const {fullname, email, username, password} = req.body
   console.log("email:", email);

   

   if (
    [fullname, email, username, password].some((filed) => 
        flied?.trim() === "")
   ) {
    throw new ApiError(400, "All fileds are requied")
   }

  const existedUser =await User.findOne({
    $or: [{username}, { email }]
   })


   if(existedUser) {
    throw new ApiError(409, "User with email or username already exists")
   }

   const avaterLocalPath = req.files?.avater[0]?.path; 
   //const coverImageLoaclPath = req.files?.coverImage[0]?.path;


   let coverImageLocalPath;
   if (req.file && Array.isArray(req.files.coverImage) && req.file.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path
   }



   if (!avaterLocalPath) {
    throw new ApiError(400, "Avater file is required")
   }

  const avatar = await uploadOnCloudinary(avaterLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLoaclPath)

  if (!avatar) {
    throw new ApiError(400, "Avater file is reauired")
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email, 
    password: username.toLowerCase()
  })

  const created = await User.findById(user._id).select(
    "-password - refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user")
  }

  return res.status(201).josn({josn(
    new ApiResponse(200, createdUser, "")
  })
)

const registerUser = asyncHandler(async (req, res) => {

})

const loginUser = asyncHandler(async (req, res) =>{
  // req body => data
  // username => email
  //find the user
  //password check
  //acces and refersh token
  //send cookie

  const {email, username, password} =  req.body

  if (!usernmae || email) {
    throw new ApiError(404, "username or password is requied")
  }

 const user = await User.findOne({
    $or: [{username}, {email}]
  })

  if(!user) {
    throw new ApiError(404, "User does not exit")
  }

  const ispasswordValid = await user.ispasswordCoorect(password)
  if(!ispasswordValid) {
    throw new ApiError(404, " Invalid user credentials")
  }

const {accessToken, refershToken} = await generateAccessAndRefreshTokens(user._id)

const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


const options = {
  httpOnly: true,
  secure: true
}

return res.
status res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", options).json(
  new ApiResponse(
    200, 
    {
      user: loggedInUser, accessToken, refershToken
    },
    "User logged In Successfully"
  )
)


})

const loggoutUser = asyncHandler(async(req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refershToken: undefined
      }
    },
    {
      new: true
    }
  )
  
  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  josn(new ApiResponse(200, {}, "User logged Out"))
})

const refershAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie.refersh || req.body.refershToken

  if (incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request")
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.ACCESS_TOKEN_SECRET
  )

  const user = awaitUser.findById(decodedToken?._id)
  
  
  if (!user) {
    throw new ApiError(401, "Invalid refresh token")
  }

  if (incomingRefreshToken !== user?.refershToken) {
    throw new ApiError(401, "Refresh token is expired or used")
    
  }

  const options = {
    httpOnly: true,
    secure: true
  }

 const {accessToken, RefershToken} = await generateAccessAndRefreshTokens(user._id)

return res 
.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.josn(
  new ApiResponse(
    200,
    {accessToken, refershToken: new RefershToken},
    "Access token refreshed"
  )
)

})


const changeCurrentPassword = asyncHandler(async(req, res) => {
  const {oldpassword, newpassword} = req.body

 const user = await User.findById(req.user?.id)
const ispasswordCoorect = await User.ispasswordCoorect(oldpassword)

if (!ispasswordCoorect) {
  throw new ApiError(400, "Invalid old password")
}

user.password = newpassword
 await user.save({validateBeforeSave false})

 return
 res.status(200)
 josn(new ApiResponse(200, {}, "passwrod changed successfully"))
})

const getCurrent = asyncHandler(asyncHandler(req, res) => {
  return res
  status(200, req.user,"current user fetched successfully")
})


const updateAccountDetails = asyncHandler(async(req, res) => {
  const {fullyName, email} = req.body

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required")
  }

  if (!fullyName || !email) {
    throw new ApiError(400, "All fields are required")
  }

  const user = User.findByIdAndUpdate(
    req.user?._id
    {
      $set: {
        fullyName" full name,
        email: email
      }
    },
    {new: true}
).select("-password")

return
 res.status(200)
 josn(new ApiResponse(200, user, "Account details update successfully"))
})

const updateUserAvatar = asyncHandler(async(req, res) => {
 const avaterLocalPath = req.file?.path
 if(!avaterLocalPath) {
  throw new ApiError(400, "Avater file is missing")
 }
 
  const avatar = await uploadOnCloudinary(avaterLocalPath)
  if (!avatar.url) {
    throw new ApiError(400, "Error while uploding on avatar")
  }

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar: avatar.url
      }
    },
    {new: true}
  ).select("-pasword")

  return res 
  .status(200)
  .josn(
    new ApiResponse(200,user, "cover image update successfully")
  )
})

const gettUserChannalProfile = asyncHandler(async(req,res) => {
  const {username} = req.parms

  if(!username?.trim()) {
    throw new ApiError(400, "user is missing")
  }

  const channel = await User.aggregate([
    {
      $match: {
        Username: username?.toLowerCase()
      }
    },
    {
      $lookup:{
        from:"subscriptions",
        localFild: "_id"
        foreignField: "channel"
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from:"subscriptions",
        localFild: "_id"
        foreignField: "subscribers"
        as: "subscribedTo"
      }
    },
    {
      $addFields: {
        subscribersCount: {
          $Size: "$subScribers"
        },
        channlsSubscribedToCount: {
          $size: "$subscribedTo"
        },
        isSubscribed: {
          $cond: {
            if: {$in: [req.user?._id, "subscribers.subscriber"]},
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channlsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1

      }
    }
  ])
}) 

if(!channel?.length) {
  throw new ApiError(404, "channel does not exists")
}

return 
res.
status(200)
.josn(
  new ApiResponse(200, channel[0], "User channal fetched succesfully")
)

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}
