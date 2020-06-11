const mongoose = require('mongoose');
const databaseURL = 'mongodb://127.0.0.1/task-manager-api';

mongoose.connect(databaseURL,
        {
         useNewUrlParser: true,
         useUnifiedTopology:true, 
         useCreateIndex: true ,
         useFindAndModify: false
        });




