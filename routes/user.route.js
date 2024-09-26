import express from "express";
import { deleteUser, getUser, getUsers, updateUser, savePost, profilePosts , getNotification} from "../controllers/user.controller.js";
import { verifyToken } from "../lib/middleware/verifyToken.js";
const  router = express.Router();


router.get('/', getUsers )
router.get('/search/:id',  verifyToken,  getUser )
 router.get('/:id',  verifyToken,  getUser )
router.put('/:id', verifyToken, updateUser )
router.delete('/:id', deleteUser )
router.post('/save',verifyToken, savePost )
router.get("/data/profilePosts", verifyToken, profilePosts)
router.get("/notification/notification", verifyToken, getNotification)
export default router;
