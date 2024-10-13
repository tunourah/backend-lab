import mongoose from 'mongoose';

const { Schema } = mongoose;

 

const userSchema = new Schema(

{

username: {

 type: String,

required: true,

unique: true

},

email: {

type: String,

required: true,

unique: true

},

password: {

type: String,

required: true

},

blogs: [{

type: mongoose.Schema.Types.ObjectId,

ref: 'Book'

}]

},

{ timestamps: true } // This adds createdAt and updatedAt timestamps for each article`

);
 

// Define the model

const User = mongoose.model("User", userSchema);

// Export the model

export default User;