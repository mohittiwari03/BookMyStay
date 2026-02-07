const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const expressError = require("../utils/expressErrors.js")
const  {listingSchema}  = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.controller.js")
const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })





//index route
router.get("/",wrapAsync(listingController.index));



//new route
router.get("/new", isLoggedIn,listingController.renderNewForm );



//show route
router.get("/:id", wrapAsync(listingController.showListing));




//create route
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

//update route
router.put("/:id",  isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync( listingController.updateListing));


//delete route
router.delete("/:id",  isLoggedIn, isOwner, listingController.deleteListing);


module.exports = router;