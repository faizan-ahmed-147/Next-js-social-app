import { checkAuth } from "../../../../middleware/isAuthenticated";

import { User } from "../../../../models/user";
import { errorHandler } from "../../../../utils/error";
import { connectDB } from "../../../../utils/feature";


export const handler = async(req,res)=>{
    try {
        if (req.method !== "GET")
            return errorHandler(res, 400, "Only GET Method is allowed");

        await connectDB();

        let user  = await checkAuth(req);
        if (!user ) return errorHandler(res, 401, "Login First");

        const userToFollow = await User.findById(req.query.id);
        const loggedInUser = await User.findById(user._id);
    
        if (!userToFollow) {
          return errorHandler(res,401,"User not found")
        }
    
        if (loggedInUser.following.includes(userToFollow._id)) {
        const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);
        const indexfollowers = userToFollow.followers.indexOf(loggedInUser._id);
  
        loggedInUser.following.splice(indexfollowing, 1);
        userToFollow.followers.splice(indexfollowers, 1);
  
        await loggedInUser.save();
        await userToFollow.save();
  
        res.status(200).json({
          success: true,
          message: "User Unfollowed",
        });
      } else {
        loggedInUser.following.push(userToFollow._id);
        userToFollow.followers.push(loggedInUser._id);
  
        await loggedInUser.save();
        await userToFollow.save();
  
        res.status(200).json({
          success: true,
          message: "User followed",
        });
      }



    } catch (error) {
        return errorHandler(res, 500, error.message);
    }
}

export default handler