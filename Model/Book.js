
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const bookSchema = mongoose.Schema({
  title: { type: String, required: true /*, unique : true*/},
  author: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  userId : {type : String,required : true},
  ratings : [{userId : {type:String},grade :{type:Number}}],
  averageRating : {type:Number},
  imageUrl: {type: String }
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Book', bookSchema);