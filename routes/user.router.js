const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.controller.js")

// Home route
router.get("/", (req,res) =>{
    res.redirect("/listings");
});

router.get("/signup",userController.renderSignUpForm);



router.post("/signup",wrapAsync( userController.signUp ));



router.get("/login", userController.renderLogInForm);



router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}),userController.logIn);



router.get("/logout", userController.logOut);


module.exports = router;