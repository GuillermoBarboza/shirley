import mongoose, { Schema, Document } from "mongoose";

interface IContactInfo extends Document {
    phoneNumber: string;
    /** Site switch for the storefront's "Ver en tu pared". Lives here so the
     *  storefront and admin reuse the contact-info endpoint they already call. */
    wallViewEnabled: boolean;
}

const ContactInfoSchema: Schema = new Schema({
    phoneNumber: { type: String, required: true },
    wallViewEnabled: { type: Boolean, default: true },
});

const ContactInfo = mongoose.model<IContactInfo>(
    "ContactInfo",
    ContactInfoSchema
);

export default ContactInfo;
