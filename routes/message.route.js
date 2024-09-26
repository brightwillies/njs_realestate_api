import express from "express";
import { addMessage } from "../controllers/message.controller.js";
import { verifyToken } from "../lib/middleware/verifyToken.js";
const  router = express.Router();


// router.get('/', getUsers )
// router.get('/search/:id',  verifyToken,  getUser )
//  router.get('/:id',  verifyToken,  getUser )
// router.put('/:id', verifyToken, updateUser )
// router.delete('/:id', deleteUser )
router.post('/:chatId',verifyToken, addMessage )
// router.get("/data/profilePosts", verifyToken, profilePosts)
export default router;

