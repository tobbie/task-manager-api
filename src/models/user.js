const mongoose = require('mongoose');
const validator = require('validator').default;

const User = mongoose.model('User', {
    name : {
        type : String,
        required : true,
        trim : true
    },
    email :{
        type: String,
        required : true,
        trim : true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Please enter a valid email');
            }

        }
    },
    age: {
        type : Number,
        default:0,
        validate(value){
            if(value < 0){
                throw new Error('age must be a postive number');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim : true,
        minlength :7,
        validate(value){
          if(value.toLowerCase().includes("password")){
                throw new Error('password value cannot be or contain the string passowrd');
            }
        }
    }
})

module.exports = User;