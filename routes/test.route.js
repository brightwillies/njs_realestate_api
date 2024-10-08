import express from "express";
import { shouldBeLoggedIn, shouldBeAdmin } from "../controllers/test.controller.js";
import { verifyToken } from "../lib/middleware/verifyToken.js";

const router = express.Router();

 router.get("/should-be-logged-in",verifyToken,  shouldBeLoggedIn )
 router.get("/should-be-admin", shouldBeAdmin )
 router.get('/me', (req, res)=>{
    res.send('hello me');
 })
export default router;