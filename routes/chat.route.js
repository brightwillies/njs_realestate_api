import express from "express";
import { getChats, getChat, addChat, readChat} from "../controllers/chat.controller.js";
import { verifyToken } from "../lib/middleware/verifyToken.js";
const  router = express.Router();


router.get('/', verifyToken,  getChats )
router.get('/:id',  verifyToken,  getChat )
router.post('/',verifyToken, addChat )
router.post('/read/:id',verifyToken, readChat )
//  router.get('/:id',  verifyToken,  getUser )
// router.put('/:id', verifyToken, updateUser )
// router.delete('/:id', deleteUser )


export default router;
