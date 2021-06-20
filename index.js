const express = require('express');
const axios = require('axios').default;
const _ = require('lodash');

// constants
const app = express();

app.use(express.json()); // This will parse json payload.
app.use(express.urlencoded({extended:true}))
app.use(express.static('public')); // This will serve public directory on our server.
app.set('view engine', 'ejs'); // So express uses ejs as its templating engine.

// Routes
app.get('/', (req,res) => {
    axios.get("https://api.imgflip.com/get_memes")
        .then((memes) => {
            return res.render('index', {
                memes: _.sampleSize (memes.data.data.memes, 100)
            })
        }) .catch((e) => { return res.status(500).send("500 internal Server Error")})
 });

app.post('/generate', (req, res) => {
    axios.post("https://api.imgflip.com/caption_image", {}, {
        params: {
            template_id : req.body.template_id,
            username: req.body.username,
            password: req.body.password,
            text0 : req.body.text0,
            text1 : req.body.text1
        }
    }).then((response) => {
        return res.send(`<img src=${response.data.data.url}>`);
    }).catch((e) => { return res.status(403).send('403 Client Error')})
})

// Listeing to server
app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});