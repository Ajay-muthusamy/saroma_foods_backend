import mongoose from 'mongoose';
import 'dotenv/config'

const uri = process.env.mongodb_uri;

export const dbconnect = async()=>{
    try {
        mongoose.connect(uri);
        console.log('Saaro Food database connected successfully');
    } catch (error) {
        console.log('Database is not Connected Successfully',error);
    }
}