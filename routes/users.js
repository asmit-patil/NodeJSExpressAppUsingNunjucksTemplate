var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId
var bcrypt = require('bcrypt');
var nunjucks  = require('nunjucks');
var mongoose = require('mongoose')
var fs=require("fs")
var rte = require('rte');
var CircularJSON = require('circular-json');
var demo=require("../demo.json")
mongoose.Promise = Promise
var MongoClient = require('mongodb').MongoClient;
nunjucks.configure('views', {
  autoescape: false,
  express   : app
});
app.use('/public', express.static('public'))
app.set('view engine', 'html');

//var url = 'mongodb://localhost:27017/testDB2';

//console.log(SALT_WORK_FACTOR)


// ///////////////////////////////////////////////SHOW LIST OF USERS////////////////////////////////////////////////////////////
app.get('/', function(req, res, next) {    
    // fetch and sort users collection by id in descending order
    req.db.collection('users').find().sort({"_id": -1}).toArray().then(function( result) {
        //if (err) return console.log(err)
         console.log(typeof result)
        // if (err) {
        //     req.flash('error', err)
        //     res.render('user/list', {
        //         title: 'User List', 
        //         data: ''
        //     })
        // } else {
            
             
             res.render('user/list', {
                title: 'User List', 
                data: result
            })
       // }
    })
})

//////////////////////////////////////////for getting unique names////////////////////////////////////////////////////////////////
app.get('/getuniquefirstnames',function(req,res,next){
    db.collection('users').distinct('firstname', function(err, docs) {
        if(err) throw err
        else{
            console.log(typeof docs)
            res.send(docs)
        }
      });
})

//////////////////////////////////////////for getting minimum-age & maximum-age & average-age///////////////////////////////////////
app.get('/getage',function(req,res,next){
   db.collection('users').aggregate(
        [
        {$group:{   _id:null,
                    min_age:{$min:"$age"},
                    max_age:{$max:"$age"},
                    avg_age:{$avg:"$age"}
                }}
        ]).toArray(
        function(err, docs) {
        if(err) throw err
        else{
            
            console.log(typeof docs)
            //console.log(CircularJSON.stringify(docs,"sdafffffffff"))
            // res.send(JSON.stringify(docs))
            res.render('demo/agedemo',{
                
                result: JSON.stringify(docs)
            })

        }
      });
})


/////////////////////////////////////////////show users as per provided query parameter and pattern///////////////////////////////
app.get('/getnames',function(req,res,next){

    var p=new RegExp(req.query.pattern)
    console.log(p)
    req.db.collection('users').find({ $or: [ { firstname: { $regex: p, $options: "i" } }, { lastname: { $regex: p, $options: "i" } } ] }).toArray(function(err, result) {
        if (err) {
            req.flash('error', err)
            res.render('user/list', {
                title: 'User List', 
                data: ''
            })
        } else {
             res.render('user/list', {
                title: 'User List', 
                data: result
            })
        }   
    })
   
       
})

///////////////////////////// to get pass and fail count from result feild///////////////////////////////////////////////
app.get('/getpassfailcount',function(req,res,next){
    req.db.collection('users').aggregate(
        [
           
           { $group: { _id: "$result", total_count: { $sum: 1 } } }
        ],
        function(err, docs) {
        if(err) throw err
        else{
            console.log(typeof docs)
            //res.send(JSON.stringify(docs))
            res.render('demo/agedemo',{
                
                result: JSON.stringify(docs)
            })
        }
      }
     )
})

//////////////////////////////////////////////////////to get pass count//////////////////////////////////////////////////////
app.get('/getpasscount',function(req,res,next){
    req.db.collection('users').aggregate(
        [
           { $match: {result:"pass"}},
           { $group: { _id: null, pass_count: { $sum: 1 } } }
        ],
        function(err, docs) {
        if(err) throw err
        else{
            console.log(docs)
            // res.send(JSON.stringify(docs))
            res.render('demo/agedemo',{
                
                result: JSON.stringify(docs)
            })
        }
      }
     )
    
})
/////////////////////////////////////////////////////////to get fail count///////////////////////////////////////////////////
app.get('/getfailcount',function(req,res,next){
    req.db.collection('users').aggregate(
        [
           { $match: {result:"fail"}},
           { $group: { _id: null, fail_count: { $sum: 1 } } }
        ],
        function(err, docs) {
        if(err) throw err
        else{
            console.log(docs)
            // res.send(JSON.stringify(docs))
            res.render('demo/agedemo',{
                
                result: JSON.stringify(docs)
            })
        }
      }
     )
    
})

////////////////////////////display users whose hobbies are either cricket or music or both////////////////////////////////
app.get('/userswithsecondcondition', function(req, res, next) {    
    // fetch and sort users collection by id in descending order
    req.db.collection('users').find({ $or: [ { hobbies: "music" }, { hobbies: "cricket"} ] }).toArray(function(err, result) {
        console.log(typeof result)
        //if (err) return console.log(err)
        if (err) {
            req.flash('error', err)
            res.render('user/list', {
                title: 'User List', 
                data: ''
            })
        } else {
             res.render('user/list', {
                title: 'User List', 
                data: result
            })
        }
    })
})

//////////////////////////////////////display list of users who has class <5 and hobby as cricket///////////////////////////////////
app.get('/userswithfirstcondition', function(req, res, next) {    
    // fetch and sort users collection by id in descending order
    
    req.db.collection('users').find({ $and: [ { class: { $gt: "5" } }, { hobbies: "cricket"} ] }).toArray(function(err, result) {
        //if (err) return console.log(err)
        if (err) {
            req.flash('error', err)
            res.render('user/list', {
                title: 'User List', 
                data: ''
            })
        } else {
            //render to views/user/list.ejs template file
            console.log(result)
            //console.log("sdafsafds",result,"dsgfgdsfdsdshfdsssssssssssss")
             res.render('user/list', {
                title: 'User List', 
                data: result
            })
        }
    })
})
//////////////////read json file and render to files according to the kay and value present in json////////////////////////////////////
fs.readFile('demo.json','utf-8','urlencoded')
app.get('/getdemojson', function(req,res,next){
    console.log(demo);
   res.render('user/demo',{
       data:demo
    });
})
//////////////////////////////////display github data by using provided githuburl///////////////////////////////////////////////
const request = require('request');
var router=require('router')
app.get('/getgitprofiledata',function(req,res,next){
const options = {  
    url: 'https://api.github.com/users/asmit-patil',
    method: 'GET',
    headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Accept-Charset': 'utf-8',
        'User-Agent': 'my-reddit-client'
    }
};

request(options, function(err, res2, body) { 
    if (err || res2.statusCode !== 200) {
        return res2.sendStatus(500);
      } 
    let json = JSON.parse(body);
    console.log(json);
    res.render('user/viewgitprofile',{
        login:json.login,
        id:json.id,
        imgurl:json.avatar_url,
        profileurl:json.html_url
    })
});



})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){    
    // render to views/user/add.ejs
    res.render('user/add', {
        title: 'Add New User',
        firstname: '',
        lastname:'',
        age: '',
        email: '' ,
        password:'',
        class:'',
        hobbies:'',
        result:''      
    })
})

// SHOW login FORM
app.get('/login', function(req, res, next){    
    // render to views/user/login.ejs
    res.render('user/login', {
        email: '' ,
        password:'' ,
        
    })
})






mongoose.connect('mongodb://localhost:27017/testDB2');
 
var db = mongoose.connection;
 
db.on('error', function(err){
    console.log('connection error', err);
});
 
db.once('open', function(){
    console.log('Connection to DB successful');
});
 
var Schema = mongoose.Schema;
var mySchema = new Schema({
    firtname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    age:{
        type: Number,
        required: true,
    },
    class:{
        type: String,
        required: true,
    },
    hobbies:{
        type: String,
        required: true,
    },
    result:{
        type: String,
        required: true
    },
   
});
 
var User = mongoose.model('users', mySchema);
 
mySchema.pre('save', function(next){
    var user = this;
    console.log(1)
    if (!user.isModified('password')) return next();
 
    // bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    //     if(err) return next(err);
    //     console.log(2)
    //     bcrypt.hash(user.password, salt, function(err, hash){
    //         if(err) return next(err);
    //         console.log(3)
    //         user.password = hash;
    //         next();
    //     });
    // });
    var SALT_WORK_FACTOR = Math.floor(Math.random() * 20);
    // if the user has modified their password, let's hash it
    bcrypt.hash(user.password,SALT_WORK_FACTOR ).then(function(hashedPassword) {
        // then let's set their password to not be the plain text one anymore, but the newly hashed password
        //var temppass= user.password
        user.password = hashedPassword

        // if(User.findOne({password: user.password}))
        // {
        //     console.log(12345)
        //     bcrypt.hash(temppass,12).then(function(hashedPassword){
        //         user.password = hashedPassword
        //     })
        // }
        next();
    }, function(err){
        // or we continue and pass in an error that has happened (which our express error handler will catch)
        return next(err)
    })
});

// now let's write an instance method for all of our user documents which will be used to compare a plain text password with a hashed password in the database. Notice the second parameter to this function is a callback function called "next". Just like the code above, we need to run next() to move on.
  function comparePassword(candidatePassword, dbpassword,next) {
    console.log(5)
    // when this method is called, compare the plain text password with the password in the database.
    bcrypt.compare(candidatePassword, dbpassword, function(err, isMatch) {
        if(err) return next(err);
        // isMatch is a boolean which we will pass to our next function
        console.log(6)
        next(null, isMatch);
    });
};
        
// ////////////////////////////////////////ADD NEW USER POST ACTION////////////////////////////////////////////
app.post('/add', function(req, res, next){    
    req.assert('firstname', 'firstName is required').notEmpty()           //Validate name
    req.assert('lastname', 'lastName is required').notEmpty() 
    req.assert('age', 'Age should be numeric').isNumeric()             //Validate age
    req.assert('email', 'A valid email is required').isEmail()  //Validate email
    req.assert('password','Password is required').notEmpty()
    req.assert('class','Class is required').notEmpty()
    req.assert('hobbies','hobbies is required').notEmpty()  
    req.assert('result', 'Name is required').notEmpty()  
    var errors = req.validationErrors()
    
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.username = '   a user    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('username').trim(); // returns 'a user'
        ********************************************/
        
        var user = new User({
            firstname: req.sanitize('firstname').escape().trim(),
            lastname: req.sanitize('lastname').escape().trim(),
            age: parseInt(req.sanitize('age').escape().trim()),
            email: req.sanitize('email').escape().trim(),
            password: req.sanitize('password').escape().trim(),
            class: req.sanitize('class').escape().trim(),
            result: req.sanitize('result').escape().trim(),
            hobbies: req.sanitize('hobbies').escape().trim().split(',')
        })
       console.log(user.hobbies)
       // req.db.collection('users').save(user, function(err, result) {
           // console.log(user.email)
           user.save(function(err,result){
            if (err) {
                req.flash('error', err)
               
                // render to views/user/add.ejs
                res.render('user/add', {
                    title: 'Add New User',
                    firstname: user.fristname,
                    lastname: user.lastname,
                    age: user.age,
                    email: user.email,
                    password:user.password,
                    class:    user.class,
                    hobbies:  user.hobbies,
                    result:user.result            
                })
            } else {                
                req.flash('success', 'Registered successfully! Now you can Login with same')
                console.log(4)
                // redirect to user list page                
                res.render('user/login',{
                    email: '',
                    password:''  
                })
            }
        })        
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '.....'
        })                
        req.flash('error', error_msg)        
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('user/add', { 
            title: 'Add New User',
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            age: req.body.age,
            email: req.body.email,
            password:req.body.password,
            class:    req.body.class,
            hobbies:  req.body.hobbies,
            result:req.body.result
        })
    }
})

////////////////////////////////////////////// login call ////////////////////////////////////////////////////////
app.post('/login', function(req, res, next){
   
    req.assert('email', 'A valid email is required').isEmail()  //Validate email
    req.assert('password','Password is required').notEmpty()    //Validate password
    var errors = req.validationErrors()
    if( !errors ) {  
           // console.log(req.body.email)
            //console.log(User.findOne({"email": "ap11@mail.com"}))
            User.findOne({email: req.body.email}).then(function(user){
               // console.log("then",user,User)
                comparePassword(req.body.password, user.password, function(err, isMatch){
                    console.log(1)
                     if(isMatch){
                        console.log(2)
                        req.flash('success', 'Login successful')
                        res.redirect('/users');
                    } else {
                        console.log(3)
                        req.flash('error', 'Login unsuccessful')
                        res.render('user/login',{
                        email: '',
                        password:''
                        });
                    }
                })
            }).catch( function(err){
                console.log(err)
                req.flash('error', error_msg)        
                console.log(4)
                res.render('user/login',{
                    email: '',
                    password:''
                })
            })
    
        
        
         

    }
    else{
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        res.render('user/login',{
            email: '',
            password:''
        })
    }
})
 
///////////////////////////////// SHOW EDIT USER FORM //////////////////////////////////////////////////////////
app.get('/edit/(:id)', function(req, res, next){
    var o_id = new ObjectId(req.params.id)
    req.db.collection('users').find({"_id": o_id}).toArray(function(err, rezult) {
        if(err) return console.log(err)
        
        // if user not found
        if (!rezult) {
            req.flash('error', 'User not found with id = ' + req.params.id)
            res.redirect('/users')
        }
        else { // if user found
            // render to views/user/edit.ejs template file
            res.render('user/edit', {
                title: 'Edit User', 
               
                id: rezult[0]._id,
                firstname: rezult[0].firstname,
                lastname:rezult[0].lastname,
                age: rezult[0].age,
                email: rezult[0].email ,
                class:rezult[0].class,
                hobbies:rezult[0].hobbies ,
                result:rezult[0].result      
            })
        }
    })    
})
 
/////////////////////////////////////////// EDIT USER POST ACTION ////////////////////////////////////////////////////
app.put('/edit/(:id)', function(req, res, next) {
    req.assert('firstname', 'firstName is required').notEmpty()           //Validate name
    req.assert('lastname', 'lastName is required').notEmpty()
    req.assert('age', 'Age is required').notEmpty()             //Validate age
    req.assert('email', 'A valid email is required').isEmail()  //Validate email
    req.assert('class','Class is required').notEmpty()
    req.assert('hobbies','hobbies is required').notEmpty()
    req.assert('result','result is required').notEmpty() 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.username = '   a user    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('username').trim(); // returns 'a user'
        ********************************************/
        var user = {
            firstname: req.sanitize('firstname').escape().trim(),
            lastname: req.sanitize('lastname').escape().trim(),
            age: parseInt(req.sanitize('age').escape().trim()),
            email: req.sanitize('email').escape().trim(),
            class: req.sanitize('class').escape().trim(),
            hobbies: req.sanitize('hobbies').escape().trim().split(','),
            result: req.sanitize('result').escape().trim(),
        }
        
        var o_id = new ObjectId(req.params.id)
        req.db.collection('users').update({"_id": o_id}, user, function(err, result) {
            if (err) {
                req.flash('error', err)
                
                // render to views/user/edit.ejs
                res.render('user/edit', {
                    title: 'Edit User',
                    id: req.params.id,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    age: req.body.age,
                    email: req.body.email,
                    class: req.body.class,
                    hobbies:req.body.hobbies,
                    result: req.body.result
                    
                })
            } else {
                req.flash('success', 'Data updated successfully!')
                
                res.redirect('/users')
                
                // render to views/user/edit.ejs
                /*res.render('user/edit', {
                    title: 'Edit User',
                    id: req.params.id,
                    name: req.body.name,
                    age: req.body.age,
                    email: req.body.email
                })*/
            }
        })        
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('user/edit', { 
            title: 'Edit User',            
            id: req.params.id, 
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            age: req.body.age,
            email: req.body.email,
            class: req.body.class,
            hobbies:req.body.hobbies,
            result: req.body.result
           
        })
    }
})
 
//////////////////////////////////////////////////////////////// DELETE USER ////////////////////////////////////////////////////////////
app.delete('/delete/(:id)', function(req, res, next) {    
    var o_id = new ObjectId(req.params.id)
    req.db.collection('users').remove({"_id": o_id}, function(err, result) {
        if (err) {
            req.flash('error', err)
            // redirect to users list page
            res.redirect('/users')
        } else {
            req.flash('success', 'User deleted successfully! id = ' + req.params.id)
            // redirect to users list page
            res.redirect('/users')
        }
    })    
})
 
module.exports = app
