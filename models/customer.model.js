// models/Order.js

import { request } from "express";
import mongoose from "mongoose";

const customerOrderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true,
    },
    landMark: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    Products: [
        {
            title: {
                type: String,
                required: true
            },
            img: {
                type: String,
            },
            price: {
                type: String,
                required: true // Assuming you want this to be required
            },
            stock: {
                type: Boolean, // Use Boolean for stock to indicate availability
                required: true // Assuming you want this to be required
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    customerId:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ProductModel = mongoose.model('Orders', customerOrderSchema);
export default ProductModel;
