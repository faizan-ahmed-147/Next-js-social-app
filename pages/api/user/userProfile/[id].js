import { checkAuth } from "../../../../middleware/isAuthenticated";
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

       
        user = await User.findById(req.query.id).populate(
            "posts followers following"
          );
      
          if (!user) {
            return errorHandler(res,400,"User Not Found")
          }
      
          res.status(200).json({
            success: true,
            user,
          });

    } catch (error) {
        return errorHandler(res, 500, error.message);
    }
};

export default handler;