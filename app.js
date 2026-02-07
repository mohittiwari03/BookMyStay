if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}




const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressErrors.js");
const session = require("express-session");
const connectMongo = require('connect-mongo');
const MongoStore = connectMongo.default;
const flash = require("connect-flash");
const passport = require("passport")
const Localstrategy = require("passport-local")
const user  = require("./models/user.js")
 


const listingRouter = require("./routes/listing.routes.js")
const reviewRouter = require("./routes/review.router.js")
const userRouter = require("./routes/user.router.js")




const dbUrl = process.env.ATLASDB_URL;


main().then(() =>{console.log("connect to DB")})
.catch((err) => {console.log(err)});

async function main(){await mongoose.connect(dbUrl)}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const  store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on('error', (err) => {
    console.error('ERROR in MONGO SESSION STORE', err);
});

const sessionOptions = {
    store : store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() * 7 * 24 * 60 *  1000,
        maxAge: 7 * 24 * 60 * 1000,
        httpOnly : true
    }
};


// app.get("/",(req,res) =>{
//     res.send("hi");
// });

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



app.use((req,res,next) =>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});


// app.set("/demouser", async(req,res) =>{
//     let fakeUser = new user({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     const newUser = await user.register(fakeUser, "helloworld");
//     res.send(newUser);
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



app.all(/.*/, (req,res,next) =>{
    next(new expressError(404, "Page not found!"));
})


app.use((err,req,res,next) =>{
    let { statusCode=500 ,message="Something went wrong" } = err;
    res.status(statusCode).render("error.ejs" , { message })
    // res.status(statusCode).send(message);
    console.log(err)

});

app.listen(8080,() =>{
    console.log("server is listening on port 8080");
});