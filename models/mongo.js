const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const uri = "mongodb+srv://kanhabindal:1234abcd@cluster0.oe2t0lw.mongodb.net/?retryWrites=true&w=majority"

const connnectDB = async ()=>{
    try {
        const conn = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        console.log('MongoDB Connected',conn.connection.host)
        
    } catch (error) {
        console.log(error.message ,"chall haatt")
    }
}
module.exports = connnectDB