import mongoose from "mongoose";
const {Schema,model}=mongoose;

const DeliverylocationSchema=new Schema({
    fullName:{ type: String, required: true },
    mobileNumber:{ type: String, required: true, match: [/^\d{10}$/, 'Mobile number must be exactly 10 digits'], },
    flatNo: {type:String,required:true},
    area :{type:String,required:true},
    landmark:{type:String},
    pincode:{ type: Number, required: true },
    city: {type:String,required:true},
    state: {type:String,required:true},
    country: {type:String,required:true},
},{ timestamps: true });

export default mongoose.models.Deliverylocation || model("Deliverylocation",DeliverylocationSchema);