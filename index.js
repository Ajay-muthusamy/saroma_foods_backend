import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { dbconnect } from "./dbConnect/database.js";
import router from "./routes/routes.js";
import "dotenv/config";

dbconnect();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/saarofoods", router);

app.post("/saarofoods/download-pdf", (req, res) => {
   const customer = req.body;
   const doc = new PDFDocument({ size: "A4", margin: 50 });
   const filename = `${customer.name}_Order.pdf`;
 
   // Set the response headers to serve a file
   res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
   res.setHeader("Content-type", "application/pdf");
 
   // Pipe the PDF document to the response
   doc.pipe(res);
 
   // Set background color
   doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f0f4f8"); // Light gray background
 
   // Main Title
   doc.fillColor("#00796b")
     .fontSize(26)
     .text("Saroma Agro Foods", { align: "center", underline: true });
 
   doc.moveDown(0.5);
 
   // GST Section
   doc.fillColor("#004d40")
     .fontSize(18)
     .text("GST - 33BSSPM5132J1Z6", { align: "left" });
 
   doc.moveDown(0.5);
 
   // Ordered Products Title
   doc.fillColor("#004d40")
     .fontSize(18)
     .text("Ordered Products:", { underline: true, align: "left" });
 
   doc.moveDown(0.5);
 
   // GST and Date Section on opposite sides
   const pageWidth = doc.page.width;
   doc.fillColor("#004d40")
     .fontSize(11)
     .text(`Bill No: ${customer.customerId}`, pageWidth - 200, doc.y, { align: "right" })
     .text(`Order Date: ${new Date(customer.createdAt).toLocaleDateString()}`, pageWidth - 200, doc.y, { align: "right" }); // Date on the right
 
   // Table Headers
   const productTableTop = doc.y;
   doc.fillColor("#00796b")
     .fontSize(12)
     .rect(50, productTableTop, 500, 30)
     .fill()
     .fillColor("#ffffff")
     .text("S.No.", 50, productTableTop + 5)
     .text("Product Name", 100, productTableTop + 5)
     .text("Price", 400, productTableTop + 5, { width: 90, align: "right" });
 
   doc.moveDown(2);
 
   // Function to check space on the page and add a new page if necessary
   function checkSpaceAndAddPage(doc, position, requiredSpace) {
     if (position + requiredSpace > doc.page.height - 100) {
       doc.addPage();
       return true; // New page added
     }
     return false; // No new page added
   }
 
   // Product Details
   customer.Products.forEach((product, index) => {
     let position = doc.y + 20;
 
     // Check if there's enough space for the next product entry; if not, add a page
     if (checkSpaceAndAddPage(doc, position, 30)) {
       position = doc.y; // Reset position after adding a page
       // Redraw headers if a new page is added
       doc.fillColor("#00796b")
         .fontSize(12)
         .rect(50, position, 500, 30)
         .fill()
         .fillColor("#ffffff")
         .text("S.No.", 50, position + 5)
         .text("Product Name", 100, position + 5)
         .text("Price", 400, position + 5, { width: 90, align: "right" });
       doc.moveDown(0.8);
     }
 
     position = doc.y;
     doc.fillColor("#004d40")
       .fontSize(12)
       .text(index + 1, 50, position)          // Align S.No.
       .text(product.title, 100, position)     // Align product title
       .text(`Rs : ${product.price}`, 400, position, { width: 90, align: "right" });  // Align price
 
     doc.moveDown(0.5);
   });
 
   doc.moveDown(0.5);
 
   // Check space for totals
   if (checkSpaceAndAddPage(doc, doc.y, 60)) {
     // Re-draw any headers if needed
   }
 
   // Calculate discount and final amount
   const totalAmount = customer.total;
   const discount = totalAmount * 0.15;  // 15% discount
   const finalAmount = totalAmount - discount;
 
   // Display amounts
   doc.fillColor("#00796b")
     .fontSize(12)
     .text(`Total Amount: Rs. ${totalAmount.toFixed(2)}`, { align: "left" })
     .moveDown(0.2)
     .text(`15% Discount: Rs. ${discount.toFixed(2)}`, { align: "left" })
     .moveDown(0.2)
     .text(`Final Amount: Rs. ${finalAmount.toFixed(2)}`, { align: "left" });
 
   doc.moveDown(10);
   drawLine(doc, doc.y);
 
   // From Address
   const addressStartY = doc.y + 10;
   const addressWidth = 200;
 
   doc.fillColor("#000000")
     .fontSize(12)
     .text("From:", 50, addressStartY, { underline: true, width: addressWidth })
     .text("Saroma Agro Foods", 50, addressStartY + 15, { width: addressWidth })
     .text("171/5-A, KKC Complex, Tiruchengode Road, Sankari,", 50, addressStartY + 30, { width: addressWidth })
     .text("Salem Dt., Tamil Nadu 637 301, India", 50, addressStartY + 60, { width: addressWidth })
     .text("Contact Person: S. Sathish", 50, addressStartY + 75, { width: addressWidth })
     .text("Phone: 99422 08824", 50, addressStartY + 90, { width: addressWidth });
 
   // To Address
   doc.fillColor("#000000")
     .fontSize(12)
     .text("To:", 350, addressStartY, { underline: true, width: addressWidth })
     .text(`Name: ${customer.name}`, 350, addressStartY + 15, { width: addressWidth })
     .text(`Phone: ${customer.phoneNo}`, 350, addressStartY + 30, { width: addressWidth })
     .text(`Pincode: ${customer.landMark}`, 350, addressStartY + 45, { width: addressWidth })
     .text(`Address: ${customer.address}`, 350, addressStartY + 70, { width: addressWidth });
 
   // End PDF
   doc.end();
 });
 
 // Function to draw a horizontal line
 function drawLine(doc, y) {
   doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
 }
 

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error in Creating Server");
  }
  console.log(`Server is running on the Port http://localhost:${PORT}`);
});
