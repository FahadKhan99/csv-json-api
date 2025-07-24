import { Router } from "express"
import { getUsers } from "../controllers/user.controllers";

const userRouter = Router();

userRouter.get("/", getUsers);

export default userRouter;