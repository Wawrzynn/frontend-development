import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

const Connection = () => {

    const MONGODB_URI = `mongodb+srv://${USERNAME}:${PASSWORD}@todo-react.ipw6rfk.mongodb.net/?retryWrites=true&w=majority`

    mongoose.connect(MONGODB_URI)

    mongoose.connection.on('connected', () => {
        console.log('Mongoose is connected!!!')
    })

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose is disconnected!!!')
    })

    mongoose.connection.on('error', (err) => {
        console.log(err, 'mongoose error')
    })
}

export default Connection;