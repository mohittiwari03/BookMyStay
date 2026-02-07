const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/bookmystay";

main().then(() =>{
    console.log("connect to DB");
})
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL)
}

const initdb = async () => {
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj, owner:"697fa354c2f0bf0db103c1b2"}));
    await listing.insertMany(initdata.data);
    console.log("data initialized");
};

initdb();