import mongoose, { HydratedDocument } from 'mongoose';
import { hashPassword, comparePassword } from '../utils/password';
import { EmployeeDocument } from './employee.model';

enum Roles { Admin, User, Mesero, Cajero };

export interface IUser {
    username: string;
    password: string;
    rol: Roles | string;
    employee: EmployeeDocument['_id'];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, mongoose.Model<IUser, {}, IUserMethods>, IUserMethods>({
    username: { type: String, required:true, unique:true, trim: true },
    password: { type: String, required:true, trim: true },
    rol: { type: String, enum: Roles, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    isActive: { type: Boolean, default: true }
},{
    timestamps: true,
    versionKey: false
});

userSchema.pre('save', async function (next){
    const user = this;

    if(!user.isModified('password')){
        return next();
    }

    const hash = await hashPassword(user.password);

    user.password = hash;

    return next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean>{
    return comparePassword(candidatePassword, this.password);
};

const User = mongoose.model<IUser, mongoose.Model<IUser, {}, IUserMethods>>('User', userSchema);

export default User;