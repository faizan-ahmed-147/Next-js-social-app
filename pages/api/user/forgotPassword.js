import { SendEmail } from "../../../middleware/SendEmail";
import { User } from "../../../models/user";
import { errorHandler } from "../../../utils/error";
import { connectDB } from "../../../utils/feature";


const handler = async (req, res) => {
    try {
        if (req.method !== "POST")
        return errorHandler(res, 400, "Only POST Method is allowed");

        await connectDB()

        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return errorHandler(res, 500, "User Not Found")
        }

        const resetPasswordTokken = user.getResetPasswordToken()

        await user.save();

        const resetUrl = `http://localhost:3000/api/user/resetPassword/${resetPasswordTokken}`

        const message = `Your password reset token is :- \n\n ${resetUrl} \n\nIf you have not requested this email then, please ignore it.`;


        try {
            await SendEmail({
                email: user.email,
                subject: "Reset Password",
                message
            })

            res.status(200).json({
                success: true,
                message: `Email send to ${user.email}`

            })


        } catch (error) {
            user.resetPasswordToken = undefined,
            user.resetPasswordExpire = undefined
            await user.save()

            return errorHandler(res,500,error.message)

        }

    } catch (error) {
        return errorHandler(res, 500, error.message)
    }
}

export default handler