import { User } from "../../../../models/user";
import { errorHandler } from "../../../../utils/error";
import { Post } from "../../../../models/post";
import { connectDB } from "../../../../utils/feature";
import { checkAuth } from "../../../../middleware/isAuthenticated";

const handler = async (req, res) => {

    await connectDB()


    let user = await checkAuth(req);
    if (!user) return errorHandler(res, 401, "Login First");

    const post = await Post.findById(req.query.id)

    if (!post) {
        return errorHandler(res, 500, "Post not Found");
    }



    if (req.method === "DELETE") {
        try {
            if (post.owner.toString() !== user._id.toString()) {
                return errorHandler(res, 401, "unathorized")
            }

            // await cloudinary.v2.uploader.destroy(post.image.public_id);

            await post.deleteOne();

            user = await User.findById(user._id)


            const index = user.posts.indexOf(req.query.id);
            user.posts.splice(index, 1);

            await user.save();

            res.status(200).json({
                success: true,
                message: "Post deleted",
            });

        } catch (error) {
            return errorHandler(res, 500, error.message)
        }

    } else if (req.method === "PUT") {
        try {
            if (post.owner.toString() !== user._id.toString()) {
                return errorHandler(res, 401, "unathorized")
            }

            post.caption = req.body.caption;

            await post.save();

            res.status(200).json({
                success: true,
                message: "Caption updated",
            });

        } catch (error) {
            return errorHandler(res, 500, error.message)
        }
    } else if (req.method === "GET") {

        try {
            if (post.likes.includes(user._id)) {
                const index = post.likes.indexOf(user._id)

                post.likes.splice(index, 1)

                await post.save()

                res.status(200).json({
                    success: true,
                    message: "Post unliked"
                })
            } else {
                post.likes.push(user._id)

                await post.save()

                return res.status(200).json({
                    success: true,
                    message: "Post Liked",
                });
            }

        } catch (error) {
            return errorHandler(res, 500, error.message)
        }
    } else {
        errorHandler(res, 400, "This method is not available");
    }


}

export default handler