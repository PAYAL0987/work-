import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, refershAccessToken, reqisterUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verify } from "jsonwebtoken";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avater",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    reqisterUser
)


router.route("/login").post(logginUser)

//Secured routes
router.route("/logout").post(verifyJWt, logoutUser)
router.route("/refresh-token").post(refershAccessToken)
router.route("/change_password").post(verifyJWt, changeCurrentPassword)
router.route("/current-user").get(verifyJWt, getCurrentUser)
router.route("/update_account").patch(verifyJWt,updateAccountDetails)
router.route("/avatar").patch(verifyJWt, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWt, upload("/coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWt, getUserChannelProfile)
router.route("/histroy").get(verifyJWt, getWatchHistory)

export default router