import { Router } from "express";
import { refershAccessToken, reqisterUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

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


export default router