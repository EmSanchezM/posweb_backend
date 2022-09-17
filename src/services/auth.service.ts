import { omit } from "lodash";
import { DocumentDefinition } from "mongoose";
import { UserDocument } from "../models/user.model";
import { signJwt } from "../utils/jwt";

export function signAccessToken(user: DocumentDefinition<Omit<UserDocument, 'comparePassword'| 'createdAt' | 'updatedAt' | 'password'>>) {
    const object: Object = {
        _id: user._id,
        username: user.username,
        employee: user.employee,
        rol: user.rol,
        isActive: user.isActive
    }; 

    const accessToken = signJwt(object, { expiresIn: '1h' });
    
    return accessToken; 
}