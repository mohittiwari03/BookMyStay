const user = require("../models/user")


module.exports.renderSignUpForm =  (req,res) =>{
    res.render("users/signup.ejs")
}



module.exports.signUp = async (req,res)=>{
    try{
        let{ username,email, password } = req.body;
        const newUser = new user({username,email, password});
        const registerUser = await user.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) =>{
            if(err){
                return next(err);
            }
        })
        req.flash("success", "Welcome to bookmystay");
        res.redirect("/listings");
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}


module.exports.renderLogInForm = (req,res) =>{
    res.render("users/login.ejs");
}

module.exports.logIn = async (req,res) =>{
        req.flash("success", "Logged In successfully");
        const redirectUrl = res.locals.redirectUrl || "/listings" ;
        res.redirect(redirectUrl);
}




module.exports.logOut = (req,res,next) =>{
    req.logout((err) =>{
        if(err) {
            return next(err);
        }
        req.flash("success", "logged out successfully");
        res.redirect("/listings");
    });
}