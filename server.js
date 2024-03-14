const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const fs = require('fs/promises'); // Use 'fs/promises' instead of 'fs'
const d3 = require('d3')
const cors = require('cors');







const app = express();
app.use(cors())
const port = 3000;

app.use(bodyParser.json());

app.post('/generate-pdf', async (req, res) => {
    try {
        const { data, config, customConfig } = req.body;


        // Read HTML template from file
        const htmlTemplate = await fs.readFile('sales-collection.html', 'utf-8');
        const htmlContent = htmlTemplate.replace('__DATA__', JSON.stringify(data)).replace('__CONFIG__', JSON.stringify(config)).replace('__CUSTOM__', JSON.stringify(customConfig));

        // Generate PDF
        const pdfBuffer = await generatePDF(htmlContent);

        // Save the PDF to a directory
        const pdfPath = 'output.pdf'; // Adjust the directory and filename as needed
        await fs.writeFile(pdfPath, pdfBuffer);

        res.contentType('application/pdf');
        res.send(pdfBuffer)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function generatePDF(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set content and generate PDF
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    return pdfBuffer;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
