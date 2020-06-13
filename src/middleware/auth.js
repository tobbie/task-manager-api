const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next ) =>{
   try {
       const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, 'taskmanagersecret');
      const user = await User.findOne({_id: decoded._id, 'tokens.token':token })
      if(!user){
          throw new Error();
      }
      req.token = token; //store token in user request 
      req.user = user; // store authenticated user in request 
      next();
   } catch (error) {
       res.status(401).send({error: 'Please authenticate'});
   }
    
}

module.exports = auth;