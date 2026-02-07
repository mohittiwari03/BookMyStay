const listing = require("../models/listing")
const Review = require("../models/review")


module.exports.createReview =  async(req,res) =>{
    let { id } = req.params;
    let Listing = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    Listing.reviews.push(newReview);

    await newReview.save();
    await Listing.save();
    req.flash("success", "Review Added");
    res.redirect(`/listings/${id}`);
}


module.exports.deleteReview = async(req,res) =>{
    let { id, reviewId } = req.params;
    // id = id.trim();
    // reviewId = reviewId.trim();
    await listing.findByIdAndUpdate(id,{ $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
}