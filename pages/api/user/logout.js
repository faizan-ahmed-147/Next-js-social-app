import { errorHandler } from "../../../utils/error";
import {  cookieSetter } from "../../../utils/feature";


const handler = (req, res)=>{
    try {
        if (req.method !== "GET")
    return errorHandler(res, 400, "Only GET Method is allowed");

        cookieSetter(res,null,false)

        res.status(200).json({
            success:true,
            message:"LogOut SuccessFully"
        })
    } catch (error) {
        return errorHandler(res,400,error.message)
    }
}

export default handler