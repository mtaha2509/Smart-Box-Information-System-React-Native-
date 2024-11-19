const dotenv=require('dotenv').config();
const port=process.env.PORT;
const mongoDb_connection_string=process.env.MONGO_URI;
const jwttoken=process.env.JWT_SECRET;
module.exports={
    port,mongoDb_connection_string,jwttoken
}