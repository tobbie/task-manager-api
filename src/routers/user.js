const express = require('express');
const User = require('../models/user');
const router = express.Router()

router.post('/users',(request, response)=>{
    const user = new User(request.body);
 
    user.save().then((result) => {
         response.status(201).send(result._id);
    }).catch((error)=>{
     response.status(400).send(error.message);
    })
 })
 
 
 router.get('/users', (request, response) => {
     User.find({}).then((users) => {
         response.status(200).send(users);
     }).catch((error)=> {
         response.status(500).send(error);
     })
 })
 
 router.get('/users/:id', (request, response) =>{
     const _id = request.params.id;
     User.findById(_id).then((user)=>{
         if(!user){
             return response.sendStatus(404);
         }
         response.status(200).send(user);
     }).catch((error) =>{
         response.status(500).send(error.message);
     })
 })

 router.patch('/users/:id', async(request, response) =>{
    const updates = Object.keys(request.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if(!isValidOperation){
        return response.status(400).send({error : "invalid operation"})
    }

    try {
        const user = await User.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators:true})
        if(!user){
            return response.sendStatus(404);
        }
        response.send(user);
        
    } catch (error) {
        response.status(500).send(error.message);
    }
 })
 
 router.delete('/users/:id', async (request, response)=>{
     try {
         const user = await User.findByIdAndDelete(request.params.id)
         if(!user){
             return response.sendStatus(404);
         }
         response.send(user);
 
     } catch (e) {
         response.status(500).send(e);
     }
 })

 
 module.exports = router;