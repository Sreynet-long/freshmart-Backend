
import jwt from "jsonwebtoken"
import {User} from '../models/user.js';

    
const AuthCheck = async (req) => {
 try {
        console.log(req, "req")
        const token = req.headers.authorization;
        console.log(token, "token")
        console.log("Hello11...")
        console.log(process.env.TOKEN_SECRET_KEY, "process.env.TOKEN_SECRET_KEY")
        // const decodedUser = jwt.verify(token, process.env.TOKEN_SECRET_KEY, { ignoreExpiration: true });
        const decodedUser = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
        console.log("Hello22...")
        console.log(decodedUser, "decodedUser")
        const getUserid = await User.findById(decodedUser.user_id);
    
        if (getUserid) {
            return{
                status: true,
                user: getUserid,
            } 
        } else {
            throw new Error("Not Authorized");
        }
    } catch (error) {
        if(error.message === "Session expired"){
            throw new Error("Session expired");
        }else{
            throw new Error("Not Authorized");
        }
        
    }
}
    
export default AuthCheck;
