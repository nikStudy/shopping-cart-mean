const mongoose = require('mongoose');
const Schema = mongoose.Schema;
titlize = require('mongoose-title-case');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
              return /^[a-z\. ]{1,50}$/i.test(v);
            },
            message: props => `${props.value} is not a valid name! Name must be alphabets (. and space are also allowed) and must be maximum 50 characters long`
          }
    },
    username: {
        type: String,
        lowercase: true,
        required: true,
        validate: {
            validator: function(v) {
              return /^[a-z\d]{5,12}$/i.test(v);
            },
            message: props => `${props.value} is not a valid username! Username must be alphanumeric and contain 5 - 12 characters`
          }
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        validate: {
            validator: function(v) {
              return /^([a-z\d\.-]{1,30})@([a-z\d-]{1,20})\.([a-z]{2,8})(\.[a-z]{2,8})?$/i.test(v);
            },
            message: props => `${props.value} is not a valid email! Please enter a valid email address, e.g. me@mydomain.com`
          }
    },
    password: {
        type: String
        // validate: {
        //     validator: function(v) {
        //       return /^[\w@-]{6,20}$/.test(v);
        //     },
        //     message: props => `Entered password value is not a valid password! Password must be alphanumeric (@, _ and - are also allowed) and must be 6 - 20 characters`
        //   }
    },
    googleId: String,
    githubId: String,
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    temporarytoken: {
        type: String,
        required: true
    },
    resettoken: {
        type: String,
        required: false
    },
    permission: {
      type: String,
      required: true,
      default: 'user'
    }
});

// userSchema.pre('save', function(next){
//     let user = this;
//     bcrypt.hash(user.password, 10, (err, hash) => {
//         if (err) return next(err);
//         user.password = hash;
//         next();
//     });
// });

// Attach some mongoose hooks
userSchema.plugin(titlize, {
    paths: [ 'name' ],
    trim: true
  });

const User = mongoose.model('user', userSchema);

module.exports = User;