const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth')
const router = express.Router()


router.get('/tasks', auth, async (request, response)=>{

    try {
        const tasks = await  Task.find({owner : request.user._id});
        response.status(200).send(tasks);
    }
    catch(e){
        response.status(500).send(e.message);
    }

})

router.get('/tasks/:id', auth, async (request, response)=>{
    const _id = request.params.id;
    try {
        const task = await Task.findOne({_id, owner: request.user._id});
        if(!task){
            return response.sendStatus(404);
        }
        response.status(200).send(task);
    }
    catch(e){
        response.status(500).send(e.message);
    }
   
})

router.patch('/tasks/:id', auth, async (request, response)=>{

    const updates = Object.keys(request.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if(!isValidOperation){
      return  response.status(400).send({error: 'Invalid update'})
    }
    
    const _id = request.params.id;
    try {
       // const task = await Task.findByIdAndUpdate(_id, request.body,{ new:true, runValidators:true})
       const task = await Task.findOne({_id, owner: request.user._id});
        if(!task){
            return response.sendStatus(404);
        }

        updates.forEach((update) => {
            task[update] = request.body[update];
        })

        await task.save();
        response.status(200).send(task)

    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/tasks', auth, async (request, response)=>{
   
   const task = new Task({
     ...request.body,
     owner: request.user._id
   });

    try {
       const result = await task.save();
       response.status(201).send(result);
    } catch (error) {
        response.status(400).send(error.message)
    }
   
    
})

router.delete('/tasks/:id',auth, async (request, response)=>{
    try {
        const task = await Task.findOneAndDelete({_id : request.params.id, owner: request.user._id})
        if(!task){
            return response.sendStatus(404);
        }
        response.send(task);

    } catch (e) {
        response.status(500).send(e);
    }
})

module.exports = router;