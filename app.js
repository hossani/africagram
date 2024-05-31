const express=require("express");
require("dotenv").config();
const app=express();
const authRoute=require('./routes/AuthRoutes');
const posteRoute=require('./routes/PostRoutes');
const likesRoute=require('./routes/LikesRoutes');
const statisticsRoute=require('./routes/StatisticsRoutes');
const followerRoute=require('./routes/FollowerRoutes');
const newfeedRoute=require('./routes/NewsFeedRoutes');
const commentRoute=require('./routes/CommentRoutes');
const profileRoute=require('./routes/ProfileRoutes');
const userRoute=require('./routes/UserRoutes');

app.use(express.json());
app.use(authRoute);
app.use(posteRoute);
app.use(likesRoute);
app.use(statisticsRoute);
app.use(followerRoute);
app.use(newfeedRoute);
app.use(commentRoute);
app.use(profileRoute);
app.use(userRoute);

const port=process.env.APP_PORT || 8000
app.listen(port,()=>{
 console.log(`Server is running on PORT ${port}....`)
})