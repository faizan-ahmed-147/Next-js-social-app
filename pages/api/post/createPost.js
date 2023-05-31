import { checkAuth } from "../../../middleware/isAuthenticated";
import { Post } from "../../../models/post";
// import cloudinary from "cloudinary"
import { User } from "../../../models/user";
import { errorHandler } from "../../../utils/error";
import { connectDB } from "../../../utils/feature";


const handler = async (req, res) => {
    try {
        if (req.method !== "POST")
        return errorHandler(res, 400, "Only POST Method is allowed");

        await connectDB()


        let user = await checkAuth(req);
        if (!user) return errorHandler(res, 401, "Login First");


        // const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
        //     folder: "instaPosts"
        // })

        const newPost = {
            caption: req.body.caption,
            image: {
                public_id: "myCloud.public_id",
                url: "myCloud.secure_url",
            },
            owner: user._id,
        }

        const post = await Post.create(newPost)
        user = await User.findById(user._id)

        user.posts.unshift(post._id)

        await user.save();

        res.status(201).json({
            success: true,
            message: "Post created",
        });

    } catch (error) {
        return errorHandler(res, 500, error.message)
    }

}
export default handler