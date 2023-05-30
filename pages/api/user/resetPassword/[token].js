import { User } from "../../../../models/user";
import crypto from "crypto"
import { errorHandler } from "../../../../utils/error";
import { connectDB } from "../../../../utils/feature";
const handler = async (req, res) => {
    try {
        if (req.method !== "PUT")
            return errorHandler(res, 400, "Only PUT Method is allowed");

        await connectDB();

        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.query.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return errorHandler(res, 500, "Token Invalid Or Expire")
        }

        if (req.body.password !== req.body.confirmPassword) {
            return errorHandler(res, 500, "password and confirm password does not match")
        }

        user.password = req.body.password;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password Updated",
        })

    } catch (error) {
        return errorHandler(res, 500, error.message)
    }
}
export default handler