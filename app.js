import express from "express";
const app = express();
import  cors from "cors";
import cookieParser  from  "cookie-parser";
app.use(express.json());
app.use(cookieParser()); 
app.use(cors({origin : process.env.CLIENT_URL, credentials: true}))
// Authentication Route 

import authRoute from "./routes/auth.route.js"
import testRoute  from "./routes/test.route.js"
import userRoute  from "./routes/user.route.js"
import postRoute  from "./routes/post.route.js"
import chatRoute from "./routes/chat.route.js"
import messageRoute from "./routes/message.route.js"


app.get('/', (req, res)=>{
    res.send('Yes');
})

app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/chats", chatRoute);
 app.use("/api/messages", messageRoute);



app.listen(5000, () => {
    console.log("server is running");
})