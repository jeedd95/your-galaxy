import { MongoClient } from "mongodb";
const url = `mongodb+srv://${process.env.DB_ADMIN_ID}:${process.env.DB_ADMIN_PW}@cluster0.0nbjvbd.mongodb.net/?retryWrites=true&w=majority`;
const options = {};
let connectDB;

if (process.env.NODE_ENV === "development") {
  if (!global._mongo) {
    global._mongo = new MongoClient(url, options).connect();
  }
  connectDB = global._mongo;
} else {
  connectDB = new MongoClient(url, options).connect();
}

export { connectDB };
