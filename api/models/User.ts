import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    role: string;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ["admin", "user"],
        default: "user",
    },
});

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
