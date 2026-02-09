const listing = require("../models/listing")


module.exports.index =  async(req,res) =>{
    const allListings = await listing.find({});
    res.render("listings/index.ejs", {allListings});
};


module.exports.renderNewForm =  (req,res) =>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res,next) =>{
    let { id } = req.params;
    const listings = await listing.findById(id)
    .populate({path:"reviews",
        populate: {path: "author"},
    })
    .populate("owner");
    if(!listings) {
        req.flash("error", "Listing you requested for does not exist!")
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listings});
}



module.exports.createListing = async(req,res,next) => {
        let url = req.file.path;
        let filename = req.file.filename;

        const newlisting = new listing(req.body.listing);
        newlisting.owner = req.user._id;
        newlisting.image = { url, filename};
        await newlisting.save();
        req.flash("success", "New Listing Created");
        res.redirect("/listings");
}


module.exports.editListing = async (req,res) =>{
    let { id } = req.params;
    const listings = await listing.findById(id);
    if(!listings) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    // Safely access image URL — listing may not have an image
    let originalImageUrl = null;
    if (listings.image && listings.image.url) {
        originalImageUrl = listings.image.url.replace("/upload", "/upload/w_250");
    }
    res.render("listings/edit.ejs", {listings, originalImageUrl});
}


module.exports.updateListing = async(req,res)=>{

    let { id } = req.params;
    let Listing = await listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        Listing.image = { url, filename};
        await Listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req,res)=>{
    let { id } = req.params;
    let deletedlisting = await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}