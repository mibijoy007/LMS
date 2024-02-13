
import mongoose, { Schema , Document, Model } from "mongoose";
import bcrypt from 'bcryptjs'
import { Scheduler } from "timers/promises";
import { timeStamp } from "console";

//email checking for validity
const emailRegexPettern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//custom interface from 'Document' type
export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    avatar:{
        public_id: string;
        url: string;
    },
    role: string;
    isVerified: boolean;
    courses: Array<{courseID:string}>;
    comparePassword: (password: string) => Promise<boolean>
}

//the userModle "Schema"
const userSchema : Schema<IUser> = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Please enter your name"]
    },
    email:{
        type: String,
        required: [true,"Please enter your email"],
        validate: {
            validator: (value:string) =>{
                return emailRegexPettern.test(value)
            },
            message: "Please enter a valid email"
        },
        unique: true
    },
    password:{
        type: String,
        required: [true,"Please enter your password"],
        minlength:[6,"Password must be at least 6 characters"],
        select: false
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role:{
        type:String,
        default: 'user'
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    courses: [
        {
            courseID: String
        }
    ]
},
{timestamps: true}
);

//hashing
userSchema.pre<IUser>('save', async function (next) {
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

//comparing passwords

userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean>{
    return await bcrypt.compare(enteredPassword, this.password);
}


//exporting userModel
const userModel: Model<IUser> = mongoose.model("User",userSchema)
export default userModel;