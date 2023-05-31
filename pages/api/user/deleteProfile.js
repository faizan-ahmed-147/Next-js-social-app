import { checkAuth } from "../../../middleware/isAuthenticated";
import { Post } from "../../../models/post";
import { User } from "../../../models/user";
import { errorHandler } from "../../../utils/error";
import { connectDB, cookieSetter } from "../../../utils/feature";




const handler = async (req, res) => {
    try {
        if (req.method !== "DELETE")
            return errorHandler(res, 400, "Only DELETE Method is allowed");

        await connectDB();

        let user = await checkAuth(req);
        if (!user) return errorHandler(res, 401, "Login First");

        user = await User.findById(user._id);
        const posts = user.posts;
        const followers = user.followers;
        const following = user.following;
        const userId = user._id;
    
        // Removing Avatar from cloudinary
        // await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    
        await user.deleteOne();
    
        // Logout user after deleting profile
    
        cookieSetter(res,null,false)
    
        // Delete all posts of the user
        for (let i = 0; i < posts.length; i++) {
          const post = await Post.findById(posts[i]);
        //   await cloudinary.v2.uploader.destroy(post.image.public_id);
          await post.deleteOne();
        }
    
        // Removing User from Followers Following
        for (let i = 0; i < followers.length; i++) {
          const follower = await User.findById(followers[i]);
    
          const index = follower.following.indexOf(userId);
          follower.following.splice(index, 1);
          await follower.save();
        }
    
        // Removing User from Following's Followers
        for (let i = 0; i < following.length; i++) {
          const follows = await User.findById(following[i]);
    
          const index = follows.followers.indexOf(userId);
          follows.followers.splice(index, 1);
          await follows.save();
        }
    
        // removing all comments of the user from all posts
        const allPosts = await Post.find();
    
        for (let i = 0; i < allPosts.length; i++) {
          const post = await Post.findById(allPosts[i]._id);
    
          for (let j = 0; j < post.comments.length; j++) {
            if (post.comments[j].user === userId) {
              post.comments.splice(j, 1);
            }
          }
          await post.save();
        }
        // removing all likes of the user from all posts
    
        for (let i = 0; i < allPosts.length; i++) {
          const post = await Post.findById(allPosts[i]._id);
    
          for (let j = 0; j < post.likes.length; j++) {
            if (post.likes[j] === userId) {
              post.likes.splice(j, 1);
            }
          }
          await post.save();
        }
    
        res.status(200).json({
          success: true,
          message: "Profile Deleted",
        });

    } catch (error) {
        return errorHandler(res, 500, error.message);
    }
};

export default handler;