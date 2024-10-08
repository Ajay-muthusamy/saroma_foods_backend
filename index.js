import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { dbconnect } from './dbConnect/database.js';
import router from './routes/routes.js';
import 'dotenv/config';


dbconnect();

const app = express();
const PORT = process.env.PORT;


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


app.use('/saarofoods', router);


app.post('/saarofoods/download-pdf', (req, res) => {
   const customer = req.body;

   // Create a new PDF document
   const doc = new PDFDocument({ size: 'A4', margin: 50 });
   const filename = `${customer.name}_Order.pdf`;

   // Set the response headers to serve a file
   res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
   res.setHeader('Content-type', 'application/pdf');

   // Pipe the PDF document to the response
   doc.pipe(res);

   // Set background color
   doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f0f4f8'); // Light gray background

   // Title of the document with color
   doc.fillColor('#00796b') // Dark teal color
      .fontSize(26)
      .text('Saroma Agro Foods', { align: 'center', underline: true });

   doc.moveDown(0.5);

   // Customer details with color
   doc.fillColor('#004d40') // Teal color
      .fontSize(18)
      .text('Customer Information', { underline: true, align: 'left' });

   doc.moveDown(0.5);


   const customerDetails = [
     { label: 'Name:', value: customer.name },
     { label: 'Phone Number:', value: customer.phoneNo },
     { label: 'Landmark:', value: customer.landMark },
     { label: 'Address:', value: customer.address },
     { label: 'Order Date & Time:', value: new Date(customer.createdAt).toLocaleString() },
   ];

   customerDetails.forEach(detail => {
       doc.fillColor('#00796b') // Dark teal color
          .fontSize(12)
          .text(detail.label, { continued: true })
          .fillColor('#000000') // Black color for value
          .text(` ${detail.value}`, { align: 'left' });
          
       doc.moveDown(0.2);
   });

   doc.moveDown(0.5); // Additional spacing before products section

   // List each product in a structured format
   doc.fillColor('#004d40') // Teal color
      .fontSize(18)
      .text('Ordered Products:', { underline: true, align: 'left' });

   doc.moveDown(0.5);

   // Set the starting position for the product table
   const productTableTop = doc.y;

   // Table headers with background color
   doc.fillColor('#00796b') // Dark teal color
      .fontSize(12)
      .rect(50, productTableTop, 500, 30) // Header background
      .fill()
      .fillColor('#ffffff') // White color for text
      .text('S.No.', 50, productTableTop + 5) // Serial number header
      .text('Product Name', 100, productTableTop + 5) // Product name header
      .text('Price', 400, productTableTop + 5, { width: 90, align: 'right' }); // Price header

   doc.moveDown(0.5);

   // Draw horizontal line under the header
   drawLine(doc, productTableTop + 35);

   // Add product details with serial numbers
   customer.Products.forEach((product, index) => {
       const position = productTableTop + 50 + index * 25; 
       doc.fillColor('#004d40') // Teal color
          .fontSize(12)
          .text(index + 1, 50, position) // Serial number
          .text(product.title, 100, position) // Product name
          .text(`Rs : ${product.price}`, 400, position, { width: 90, align: 'right' }); // Price

       drawLine(doc, position + 15); // Draw line under each product
   });

   doc.moveDown(0.5);

   // Total amount section
   doc.fillColor('#000000EF') // Dark teal color
       .text(`Total Amount: ${customer.total}`, { align: 'center', fontSize: 40 });

   doc.moveDown(0.5);

   // Thank you note
   doc.fillColor('#00796b') // Dark teal color
      .fontSize(10)
      .text('Thank you for your order!', { align: 'center' });

   // Finalize the PDF and send it
   doc.end();
});

// Function to draw a horizontal line
function drawLine(doc, y) {
   doc.strokeColor('#aaaaaa') // Set line color
      .lineWidth(1) // Set line width
      .moveTo(50, y) // Start position
      .lineTo(550, y) // End position
      .stroke(); // Draw the line
}


  app.post('/api/orders', (req, res) => {
   const orderData = req.body;
   console.log('Order received:', orderData); 
   
   res.status(200).json({ message: 'Order received successfully' });
 });



app.listen(PORT, (err) => {
    if (err) {
        console.log('Error in Creating Server');
    }
    console.log(`Server is running on the Port http://localhost:${PORT}`);
});
