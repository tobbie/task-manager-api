const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth')
const {sendWelcomeEmail, sendCancellationEmail} = require('../emails/mailer')


const router = express.Router()

router.post('/users', async (request, response)=>{
    const user = new User(request.body);
    try {
          await user.save()
         // sendWelcomeEmail(user.email, user.name)
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
        sendCancellationEmail(request.user.email, request.user.name);
        response.send(request.user);
 
     } catch (e) {
         response.status(500).send(e);
     }
 })

const upload = multer({
    limits: {
        fileSize: 1000000 //accept file with max size of 1MB.
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
         return  cb(new Error('Please upload an image file.'))
        }
        cb(undefined, true);
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //resize and set image on user instance
    const buffer = await sharp(req.file.buffer).resize({height:250, width:250}).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save();
    res.send('avatar uploaded')
}, (error, req, res, next)=>{
    res.status(400).send({ error :error.message });
})

router.delete('/users/me/avatar', auth,  async (request, response)=>{
    try {
        request.user.avatar = undefined;
        await request.user.save();
        response.status(200).send();
    } catch (error) {
        response.status(500).send({error: error.message})
    } 

})

router.get('/users/:id/avatar', async (request, response)=>{
        try {
            const user = await User.findById(request.params.id);
            if(!user){
                throw new Error();
            }
            response.set('Content-Type', 'image/png');
            response.send(user.avatar);
        } catch (error) {
            
        }
})



module.exports = router;