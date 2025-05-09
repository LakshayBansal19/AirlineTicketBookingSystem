const express=require('express');
const bodyParser=require("body-parser");
const app=express();
const apiRoutes=require('./routes/index');

const {PORT}=require('./config/serverConfig');

const db=require('./models/index')

const setUpAndStartServer=()=>{

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    app.use('/api',apiRoutes);

    app.listen(PORT,()=>{
        console.log(`Server started at PORT ${PORT}`);

        if(process.env.DB_SYNC){
            db.sequelize.sync({alter:true});
        }
    });
}

setUpAndStartServer(); 