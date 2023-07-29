const express = require('express');
const taskRouter = require('./routes/user.router');
const app = express();
const port = 7373;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/task',taskRouter);
app.use('profile', express.static('public/images'));

app.listen(port,() => {
    console.log(`Server Is Running On ${port}`);
});
