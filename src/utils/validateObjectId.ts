import mongoose from "mongoose";

export function validateObjectID(id: string | mongoose.Types.ObjectId ) {
    let message: string = '';

    if(!mongoose.Types.ObjectId.isValid(id)) {
        message = `${id} no es un identificador valido`
    }

    return message; 
}