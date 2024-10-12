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
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const filename = `${customer.name}_Order.pdf`;

  // Set the response headers to serve a file
  res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-type', 'application/pdf');

  // Pipe the PDF document to the response
  doc.pipe(res);

  // Set background color
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f0f4f8'); // Light gray background

  // Main Title
  doc.fillColor('#00796b')
    .fontSize(26)
    .text('Saroma Agro Foods', { align: 'center', underline: true });

  doc.moveDown(0.5);

  doc.fillColor('#004d40')
    .fontSize(18)
    .text('GST - 33BSSPM5132J1Z6', {align: 'left' });
    doc.moveDown(0.5);
  // Products Section Title
  doc.fillColor('#004d40')
    .fontSize(18)
    .text('Ordered Products:', { underline: true, align: 'left' });

  doc.moveDown(0.5);

  // Table Headers
  const productTableTop = doc.y;
  doc.fillColor('#00796b') // Dark teal color
    .fontSize(12)
    .rect(50, productTableTop, 500, 30) // Header background
    .fill()
    .fillColor('#ffffff') // White color for text
    .text('S.No.', 50, productTableTop + 5) // Serial number header
    .text('Product Name', 100, productTableTop + 5) // Product name header
    .text('Price', 400, productTableTop + 5, { width: 90, align: 'right' }); // Price header

  doc.moveDown(0.5);
  drawLine(doc, productTableTop + 35);

  // Product Details
  customer.Products.forEach((product, index) => {
    const position = productTableTop + 50 + index * 25;
    doc.fillColor('#004d40')
      .fontSize(12)
      .text(index + 1, 50, position) // Serial number
      .text(product.title, 100, position) // Product name
      .text(`Rs : ${product.price}`, 400, position, { width: 90, align: 'right' }); // Price

    drawLine(doc, position + 15); // Draw line under each product
  });

  doc.moveDown(0.5);
  
  // Total Amount Section
  doc.fillColor('#00796b')
    .fontSize(13)
    .text(`Total Amount: Rs. ${customer.total}`, { align: 'center', fontSize: 40 });

    doc.moveDown(10);
  drawLine(doc, doc.y);
  const addressStartY = doc.y + 100; // Y position for the address sections
  const addressWidth = 200; // Width constraint for From and To addresses

  // From Address (with width constraint)
  doc.fillColor('#000000') // Black color for address text
   .fontSize(12)
   .text('From:', 50, addressStartY, { underline: true, width: addressWidth }) 
   .moveDown(0.2)
   .text('Saroma Agro Foods', 50, addressStartY + 15, { width: addressWidth })
   .text('171/5-A, KKC Complex, Tiruchengode Road, Sankari,', 50, addressStartY + 30, { width: addressWidth })
   .text('Salem Dt., Tamil Nadu 637 301, India', 50, addressStartY + 60, { width: addressWidth })
   .moveDown(0.2)
   .text('Contact Person: S. Sathish', 50, addressStartY + 75, { width: addressWidth })
   .text('Phone: 99422 08824', 50, addressStartY + 90, { width: addressWidth });

    

  doc.fillColor('#000000')
    .fontSize(12)
    .text('To:', 350, addressStartY, { underline: true, width: addressWidth }) 
    .moveDown(0.2)
    .text(`Name: ${customer.name}`, 350, addressStartY + 15, { width: addressWidth })
    .text(`Phone: ${customer.phoneNo}`, 350, addressStartY + 30, { width: addressWidth })
    .text(`Pincode: ${customer.landMark}`, 350, addressStartY + 45, { width: addressWidth })
    .text(`Order Date: ${new Date(customer.createdAt).toLocaleString()}`, 350, addressStartY + 58, { width: addressWidth })
    .text(`Address: ${customer.address}`, 350, addressStartY + 70, { width: addressWidth })
   ;

  doc.end();
});

// Function to draw a horizontal line
function drawLine(doc, y) {
  doc.strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}




app.listen(PORT, (err) => {
    if (err) {
        console.log('Error in Creating Server');
    }
    console.log(`Server is running on the Port http://localhost:${PORT}`);
});
