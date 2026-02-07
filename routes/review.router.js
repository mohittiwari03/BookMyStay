const express = require("express");
const router = express.Router( {mergeParams: true });
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const expressError = require("../utils/expressErrors.js")
const  Review  = require("../models/review.js")
const { validateReview, isLoggedIn, isReviewAuther } = require("../middleware.js");

const reviewController = require("../controllers/reviews.controller.js")




//reviews 
//post route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn, isReviewAuther, wrapAsync(reviewController.deleteReview));


module.exports  = router;