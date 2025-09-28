import mongoose from "mongoose";

export const connection = () => {
  return mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to database."))
    .catch((err) => {
      console.log("Error connecting to database:", err);
      throw err;
    });
};
