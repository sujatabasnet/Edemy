// we need to write user schema 
//we do not want to dump everything that the request body has in our database
//helps in choosing which parts of the incoming data to be saved in database

import mongoose from "mongoose";
const {Schema} = mongoose;
const {ObjectId} = Schema;

const userSchema = new Schema({
    name:{
        type: String,
        trim:true,//removes unnecessary blank spaces in the beginning
        required: true,
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique:true,
    },
    password:{
        type:String,
        required: true,
        minlength:6,
        maxlength: 64,
    },
    picture:{
        type:String, 
        default:"/avatar.png",
    },
    role:{
        type:[String],
        default:["Subscriber"],
        enum:["Subscriber", "Instructor", "Admin"],
    },

    stripe_account_id:{
        type:String,
    },
    stripe_seller: {
        type:Object,
    },
    stripeSession: {
        type:Object,  
    },
    passwordResetCode: {
        type: String,
        default:"",
    },
    courses: [{type: ObjectId, ref: "Course"}],
},
{timestamps: true}//stores (created at) and (updated at) whenever any change happens in the database
);

export default mongoose.model("User", userSchema);
//"Users" is the name given to the model and it 
//will be used to interact with the MongoDb collection associated with this model 

//this schema has two arguments, second one being the timestamp