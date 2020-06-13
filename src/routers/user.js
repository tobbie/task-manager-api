const express = require('express');
const User = require('../models/user');
const router = express.Router()
const auth = require('../middleware/auth')

router.post('/users', async (request, response)=>{
    const user = new User(request.body);
    try {
          await user.save()
          const token = await user.generateAuthToken();
          response.status(201).send({user, token});
    } catch (error) {
    response.status(400).send(error.message);
     }
       
 })
 
router.post('/users/login', async(request, response)=>{
    try {
        const user = await User.findByCredentials(request.body.email, request.body.password);
        const token = await user.generateAuthToken();
        response.send({user, token});
        
    } catch (error) {
        response.status(400).send(error.message)
    }
})

router.post('/users/logout', auth, async( request, response) => {
    try {
            request.user.tokens = request.user.tokens.filter((token) => {
                return request.token !== token.token
            });

            await request.user.save();
            response.send({message:"logged out"});
        
    } catch (error) {
        response.status(500).send(error);
    }
})

router.post('/users/logoutAll', auth, async (request, response)=> {
    try {
        request.user.tokens = [];
        await request.user.save();
        response.send({message:"logged out from all devices"});
        
    } catch (error) {
        response.status(500).send(error);
    }
})
 
router.get('/users/me', auth, async (request, response) => {
    response.send(request.user);    
 })


router.patch('/users/me', auth,  async(request, response) =>{
    const updates = Object.keys(request.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if(!isValidOperation){
        return response.status(400).send({error : "invalid operation"})
    }

    try {
        //const user = await User.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators:true})
        // const user = await User.findById(request.user._id);
        // if(!user){
        //     return response.sendStatus(404);
        // }
        const user = request.user;
        updates.forEach((update)=> {
            user[update] = request.body[update];
        })
        await user.save();
        response.send(user);
        
    } catch (error) {
        response.status(500).send(error.message);
    }
 })
 
router.delete('/users/me', auth, async (request, response)=>{
     try {  
        await request.user.remove();
        response.send(request.user);
 
     } catch (e) {
         response.status(500).send(e);
     }
 })

 
 module.exports = router;