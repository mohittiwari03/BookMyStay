const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { string } = require("joi");

const listingschema = new Schema({
    title: String,
    description:String,
    image: {
      url: String,
      filename:String
    },
    price:Number,
    location:String,
    country:String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user"
      }
});

listingschema.post("findOneAndDelete", async (listing) =>{
  if(listing){
    await Review.deleteMany({id : {$in: listing.reviews}});
  }
})

const listing = mongoose.model("listing",listingschema);
module.exports = listing;