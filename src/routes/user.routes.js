import { Router } from "express";
import { reqisterUser } from "../controllers/user.controller";

const router = Router()

router.route("/register").post(reqisterUser)


export default router