import { User } from "../../../models/user";
import { errorHandler } from "../../../utils/error";
import { connectDB, cookieSetter } from "../../../utils/feature";
import cloudinary from "cloudinary"


const handler = async (req, res) => {
    try {



        if (req.method !== "POST")
            return errorHandler(res, 400, "Only POST Method is allowed");
            
        const { name, email, password, avatar } = req.body;

        await connectDB()

        let user = await User.findOne({ email });
        if (user) {
            return errorHandler(res, 500, "User already exists")
        }

        // const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        //     folder: "avatars",
        // });

        user = await User.create({
            name,
            email,
            password,
            avatar: { public_id: "myCloud.public_id", url: "myCloud.secure_url" },
        });

        const token = await user.generateToken();


        cookieSetter(res, token, true)
        res.status(200).json({
            success: true,
            user,
            token
        })
    } catch (error) {
        return errorHandler(res, 500, error.message)
    }


}

export default handler