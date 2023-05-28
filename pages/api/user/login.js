import { User } from "../../../models/user";
import { errorHandler } from "../../../utils/error";
import { connectDB, cookieSetter } from "../../../utils/feature";


const handler = async(req, res)=>{
try {
    if (req.method !== "POST")
    return errorHandler(res, 400, "Only POST Method is allowed");


    const {email, password}= req.body

    await connectDB()
    
    let user = await User.findOne({email}).select("+password")
    if (!user) {
       return errorHandler(res, 400, "User Does not exist") 
    }

    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
        return errorHandler(res, 500, "Incorrect Password")
    }
    const token = await user.generateToken()
   
    cookieSetter(res, token, true)

    res.status(200).json({
        success: true,
        user,
        token,
        message: "User Login Successfully"
    })

} catch (error) {
   return errorHandler(res,500,error.message)
}

}

export default handler