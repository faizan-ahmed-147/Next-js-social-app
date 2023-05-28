import { checkAuth} from "../../../middleware/isAuthenticated";
import { User } from "../../../models/user";
import { errorHandler } from "../../../utils/error";
import { connectDB } from "../../../utils/feature";



// update Password 

const handler = async (req, res) => {
    try {
        if (req.method !== "PUT")
            return errorHandler(res, 400, "Only PUT Method is allowed");

        await connectDB();

        let user = await checkAuth(req);
        if (!user) return errorHandler(res, 401, "Login First");

        user = await User.findById(user._id).select("+password");

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return errorHandler(res, 400, "Please provide old and new password");
        }

        const isMatch = await user.matchPassword(oldPassword);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Old password",
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password Updated",
        });
    } catch (error) {
        return errorHandler(res, 500, error.message);
    }
};

export default handler;