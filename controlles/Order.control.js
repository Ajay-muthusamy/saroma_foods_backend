import express from "express";
import ProductModel from "../models/customer.model.js";

export const CustomerOrders = async (req, res) => {
    const orderData = req.body;
    console.log(orderData.products);
  
    try {
      // Find the latest product by productId
      const latestProduct = await ProductModel.findOne().sort({ customerId: -1 });
  
      // Set default nextIdNumber to 1 if no products exist
      let nextIdNumber = 1;
  
      // If a product exists, increment the last number in the ID
      if (latestProduct && latestProduct.customerId) {
        const lastId = latestProduct.customerId;
        const lastNumber = parseInt(lastId.replace("SAFDOA", "")); // Extract the number from the last ID
        nextIdNumber = lastNumber + 1;
      }
  
      // Create the new productId with a 3-digit zero-padded format
      const newProductId = `SAFDOA${nextIdNumber.toString().padStart(3, "0")}`;
      console.log(newProductId);
  
      // Create the new product data using the customer details and new productId
      const productData = new ProductModel({
        name: orderData.customerDetails.name,
        phoneNo: orderData.customerDetails.phoneNo,
        landMark: orderData.customerDetails.landMark,
        address: orderData.customerDetails.address,
        Products: orderData.products, // Assuming this is an array
        total: orderData.total,
        customerId: newProductId // Assign the generated customer ID
      });
  
      // Save the product data to the database
      await productData.save();
  
      console.log("Order successfully inserted with customerId:", newProductId);
  
      res.status(200).json({ message: "Order successfully inserted", customerId: newProductId });
    } catch (error) {
      console.error("Error inserting order:", error);
      res.status(500).json({ message: "Order not successfully inserted", error });
    }
  };
  
export const cutomerData = async (req, res) => {
  try {
    const data = await ProductModel.find();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "data not fetched" });
  }
};
