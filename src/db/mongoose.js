const mongoose = require('mongoose');
const databaseURL = process.env.MONGODB_URL;

mongoose.connect(databaseURL,
        {
         useNewUrlParser: true,
         useUnifiedTopology:true, 
         useCreateIndex: true ,
         useFindAndModify: false
        });




