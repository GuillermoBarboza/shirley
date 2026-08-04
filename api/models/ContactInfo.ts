import mongoose, { Schema, Document } from "mongoose";

interface IContactInfo extends Document {
    phoneNumber: string;
}

const ContactInfoSchema: Schema = new Schema({
    phoneNumber: { type: String, required: true },
});

const ContactInfo = mongoose.model<IContactInfo>(
    "ContactInfo",
    ContactInfoSchema
);

export default ContactInfo;
