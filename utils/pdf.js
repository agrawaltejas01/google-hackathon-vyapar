const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

function processPDFs(baseDir, outputDirName) {
  // Construct paths based on parameters
  const dirPath = path.join(baseDir, "data", outputDirName, "statements");
  const outputDir = path.join(baseDir, "output", outputDirName, "raw");

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  // Read the directory
  fs.readdir(dirPath, async (err, files) => {
    if (err) {
      console.log("Error reading directory:", err);
      return;
    }

    // Initialize an array to hold all PDF data
    let pdfResults = [];

    for (let file of files) {
      if (path.extname(file) === ".pdf") {
        let filePath = path.join(dirPath, file);
        let dataBuffer = fs.readFileSync(filePath);

        try {
          let data = await pdf(dataBuffer);

          // Create an object for each PDF
          let pdfObject = {
            name: file,
            totalPage: data.numpages,
            content: []
          };

          // Split text by a common page break marker, often found in PDF text extraction
          let pages = data.text.split(/(?=Page \d+)/);

          pages.forEach((pageText, index) => {
            // Clean and trim text for each page
            pdfObject.content.push(pageText.trim());
          });

          // Add the object to the results array
          pdfResults.push(pdfObject);
        } catch (error) {
          console.log(`Error processing ${file}:`, error);
        }
      }
    }

    // Optionally, write the JSON data to a file or handle it as needed
    const outputFile = path.join(outputDir, "pdf-data.json");
    fs.writeFileSync(outputFile, JSON.stringify(pdfResults, null, 2));
    console.log(`PDF data has been written to ${outputFile}`);
  });
}

module.exports = processPDFs;
