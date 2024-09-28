import express from "express";
const app = express();
import  cors from "cors";
import cookieParser  from  "cookie-parser";
app.use(express.json());
app.use(cookieParser()); 
// app.use(cors({
//     origin: '*', // Allows requests from any origin
//     credentials: true, // Allows sending cookies or credentials
//   }));

// const cors = require('cors');

const allowedOrigins = [
  'https://njs-realestate-swart.vercel.app', // Specific origin
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow the request if the origin is in the allowed list or if there's no origin (for non-browser requests)
    } else {
      callback(null, true); // Keep CORS open for other origins as well
    }
  },
  credentials: true, // Allows sending cookies or credentials
}));
//  app.use(cors({origin : process.env.CLIENT_URL, credentials: true}))
//app.use(cors({origin : 'https://njs-realestate-swart.vercel.app', credentials: true}))
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
