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



    if (req.method === "PUT") {
        try {

            let commentIndex = -1;

            // Checking if comment already exists

            post.comments.forEach((item, index) => {
                if (item.user.toString() === user._id.toString()) {
                    commentIndex = index;
                }
            });

            if (commentIndex !== -1) {
                post.comments[commentIndex].comment = req.body.comment;

                await post.save();

                return res.status(200).json({
                    success: true,
                    message: "Comment Updated",
                });
            } else {
                post.comments.push({
                    user: user._id,
                    comment: req.body.comment,
                });

                await post.save();
                return res.status(200).json({
                    success: true,
                    message: "Comment added",
                });
            }

        } catch (error) {
            return errorHandler(res, 500, error.message)
        }

    } else if (req.method === "DELETE") {
        try {
            // Checking If owner wants to delete

            if (post.owner.toString() === user._id.toString()) {
                if (req.body.commentId === undefined) {
                    return errorHandler(res,401,"Comment Id is required",)
                }

                post.comments.forEach((item, index) => {
                    if (item._id.toString() === req.body.commentId.toString()) {
                        return post.comments.splice(index, 1);
                    }
                });

                await post.save();

                return res.status(200).json({
                    success: true,
                    message: "Selected Comment has deleted",
                });
                
            } else {
                post.comments.forEach((item, index) => {
                    if (item.user.toString() === user._id.toString()) {
                        return post.comments.splice(index, 1);
                    }
                });

                await post.save();

                return res.status(200).json({
                    success: true,
                    message: "Your Comment has deleted",
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