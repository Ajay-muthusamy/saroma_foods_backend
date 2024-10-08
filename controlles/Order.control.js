import express from 'express';
import ProductModel from '../models/customer.model.js';

export const CustomerOrders = async(req,res)=>{
    const orderData = req.body;
    console.log(orderData.products);

    try {
        const productData =  ProductModel({
            name:orderData.customerDetails.name,
            phoneNo:orderData.customerDetails.phoneNo,
            landMark:orderData.customerDetails.landMark,
            address:orderData.customerDetails.address,
            Products:orderData.products,
            total:orderData.total
        });
        await productData.save();
        console.log('inserted')
        res.status(200).json({message:"successfully inserted"})
    } catch (error) {
        res.status(500).json({message:"not successfully inserted"})
        console.log(error);
    }   
}

export const cutomerData = async(req,res)=>{
    try {
        const data = await ProductModel.find();
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"data not fetched"});
    }
}