const express = require('express');
const router = require('./routes/router');
const app = express();
const port = 7373;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/task',router);

app.listen(port,() => {
    console.log(`Server Is Running On ${port}`);
});