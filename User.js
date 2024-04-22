const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Add this line to import the Schema object

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  isAdmin: { type: Boolean, default: false },
  blog: [
    {
      type: Schema.Types.ObjectId,
      ref: "Blog"
    }
  ]
});

const User = mongoose.model('User', userSchema);
module.exports = User;



