import { checkAuth} from "../../../middleware/isAuthenticated";
import { User } from "../../../models/user";
import { errorHandler } from "../../../utils/error";
import { connectDB } from "../../../utils/feature";




const handler = async (req, res) => {
    try {
        if (req.method !== "PUT")
            return errorHandler(res, 400, "Only PUT Method is allowed");

        await connectDB();

        let user = await checkAuth(req);
        if (!user) return errorHandler(res, 401, "Login First");

        user = await User.findById(user._id);
  
        const { name, email, avatar } = req.body;
     
    
        if (name) {
          user.name = name;
        }
        if (email) {
          user.email = email;
        }
    
        if (avatar) {
        //   await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    
        //   const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        //     folder: "avatars",
        //   });
          user.avatar.public_id = "myCloud.public_id;"
          user.avatar.url = "myCloud.secure_url";
        }
    
        await user.save();
    
        res.status(200).json({
          success: true,
          message: "Profile Updated",
        });

    } catch (error) {
        return errorHandler(res, 500, error.message);
    }
};

export default handler;