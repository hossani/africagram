const express=require("express")
require("dotenv").config()
const app=express();
const authRoute=require('./routes/AuthRoutes');
const posteRoute=require('./routes/PostRoutes');
const likesRoute=require('./routes/LikesRoutes');

app.use(express.json());
app.use(authRoute);
app.use(posteRoute);
app.use(likesRoute);

const port=process.env.APP_PORT || 8000
app.listen(port,()=>{
 console.log(`Server is running on PORT ${port}....`)
})