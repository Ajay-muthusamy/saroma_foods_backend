import mongoose from 'mongoose';
import 'dotenv/config'

const uri = "mongodb+srv://ajaymdu18:aSTpDhF0DR4sgL4h@cluster0.07kut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const dbconnect = async()=>{
    try {
        mongoose.connect(uri);
        console.log('Saaro Food database connected successfully');
    } catch (error) {
        console.log('Database is not Connected Successfully',error);
    }
}