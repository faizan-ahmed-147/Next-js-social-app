import mongoose from "mongoose";
import { serialize } from "cookie";

export const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.DATABASE)
        console.log('DATABASE connected')
    } catch(error) {
        console.log(error)
        process.exit()
    }
 }



export const cookieSetter = (res, token, set) => {
    res.setHeader(
      "Set-Cookie",
      serialize("token", set ? token : "", {
        path: "/",
        httpOnly: true,
        maxAge: set ? 15 * 24 * 60 * 60 * 1000 : 0,
      })
    );
  };