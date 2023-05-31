import { checkAuth } from "../../../../middleware/isAuthenticated";
import { Post } from "../../../../models/post";
import { User } from "../../../../models/user";
import { errorHandler } from "../../../../utils/error";
import { connectDB } from "../../../../utils/feature";




const handler = async (req, res) => {
    try {
        if (req.method !== "GET")
            return errorHandler(res, 400, "Only GET Method is allowed");

        await connectDB();

        let user = await checkAuth(req);
        if (!user) return errorHandler(res, 401, "Login First");

        user = await User.findById(user._id)

        const posts = [];
  
        for (let i = 0; i < user.posts.length; i++) {
          const post = await Post.findById(user.posts[i]).populate(
            "likes comments.user owner"
          );
          posts.push(post);
        }

        res.status(200).json({
            success: false,
            posts
        })
    } catch (error) {
        return errorHandler(res, 500, error.message);
    }
};

export default handler;