import express from 'express';
import bodyParser from 'body-parser';
import UserAuth from './Routes/UserAuth.js';
import Home from './Routes/Home.js';
import UserReview from './Routes/UserReview.js'

import conn from './ConnDBFile/dbConn.js';


const app = express();
const PORT = (process.env.PORT || 3000);

app.use(bodyParser.json());

app.use('/UserAuth', UserAuth);
app.use('/UserReview', UserReview);
app.use('/Home', Home);
app.get('/', (req, res)=>{
    res.send('working');
});

app.listen(PORT, ()=>console.log('working perfectly'));
