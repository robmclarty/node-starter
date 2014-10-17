var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');


// Schema
// ======

var UserSchema = mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  
  profile: {
    displayName:  { type: String, default: '' },
    location:     { type: String, default: '' },
    description:  { type: String, default: '' },
    website:      { type: String, default: '' },
    twitter:      { type: String, default: '' },
    avatar:       { type: String, default: '' } 
  },

  createdAt:  { type: Date, default: Date.now },
  updatedAt:  { type: Date, default: Date.now }
});


// Validations
// ===========

UserSchema.path('email').required(true, 'Email cannot be blank.');

// UserSchema.path('password').validate(function (value) {
//   return value.length < 5;
// }, 'Password must be at least 5 characters long.');


// Methods
// =======

UserSchema.methods = {
  generateHash: function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },

  validPassword: function(password) {
    return bcrypt.compareSync(password, this.password);
  },

  findByEmail: function(email, callback) {
    this.find({ email: new RegExp(email, 'i') }, callback);
  }
};

module.exports = mongoose.model('User', UserSchema);
