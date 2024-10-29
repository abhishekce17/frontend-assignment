require("dotenv").config();
const mongoosedb = require("mongoose");
const mongoURI = process.env.MONGODB_URI;

const connectToMongo = async () => {
  try {
    await mongoosedb.connect(mongoURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
  }
};
mongoosedb.set("strictQuery", true);
export default connectToMongo;
