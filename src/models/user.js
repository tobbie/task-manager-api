const mongoose = require('mongoose');
const validator = require('validator').default;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email :{
        type: String,
        unique: true,
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
    },
    tokens : [{
        token:{
            type: String,
            required: true
        }
    }],
    avatar :{
        type : Buffer
    }
}, {
    timestamps:true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function (){
    const user = this;
    const token =  jwt.sign({_id: user._id.toString()}, 'taskmanagersecret')
    user.tokens = user.tokens.concat({token: token})
    await user.save();
    return token;
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userObect = user.toObject();
    
    delete userObect.tokens;
    delete userObect.password;
    delete userObect.avatar;

    return userObect;
}

userSchema.statics.findByCredentials = async (email, password) =>{
    const user = await User.findOne({ email });
    if(!user){
        throw new Error('unable to login');
    }

     const isMatch = await bcrypt.compare(password, user.password);
     if(!isMatch){
        throw new Error('unable to login');
     }
     return user;
}

//hash plain text password
userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({owner : user._id});
    next();
})

const User = mongoose.model('User', userSchema)


module.exports = User;