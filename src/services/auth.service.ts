import { omit } from "lodash";
import { DocumentDefinition } from "mongoose";
import { UserDocument } from "../models/user.model";
import { signJwt } from "../utils/jwt";

export function signAccessToken(user: DocumentDefinition<Omit<UserDocument, 'comparePassword'| 'createdAt' | 'updatedAt' | 'password'>>) {
    
    const accessToken = signJwt(user, { expiresIn: '1h' });

    return accessToken; 
}