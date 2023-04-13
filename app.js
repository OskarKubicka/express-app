const express = require('express')
const app = express()
const port = 1000
var mysql = require('mysql');
const session = require('express-session')
app.use(express.static('public'))

let bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true
}))

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'alexanderthegreat',
    database: 'express_demo'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});




app.listen(port, () => {
    console.log(`Example lol app listening on port ${port}`)
})


app.get('/logged-in', (req, res)=> {
    if(req.session.authenticated){
        res.sendFile(__dirname + '/views/logged-in.html');
    }else res.redirect('/input')
    
})

app.get('/api/getuser', (req, res) => {
    res.json('{"name": "Gustav"}');
})

app.post('/input', (req, res) => {
    console.log(req.body)
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password)
    connection.query(`SELECT * FROM users WHERE email = '${email}' AND password='${password}'`, function (error, results, fields) {


        if (error) throw error;

        if (results.length > 0) {
           // res.send('Found' + results.length + 'users')
            req.session.authenticated = true
            res.redirect('/logged-in')
        }
        else {
            res.send('Found no users')
        }
        console.log(results);
    });


})

// app.get('/random', (req, res) => {
//     res.sendFile(__dirname + '/views/index.html')

// })

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')

})

app.get('/input', (req, res) => {
    res.sendFile(__dirname + '/views/input.html')
})

// app.get('/nd', (req, res) => {
//     res.send('response text')
// })
