const fs = require("fs");
const path = require("path");
const template = require("./prompt/statement");
const processPDFs = require("./utils/pdf");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const { PromptTemplate } = require("@langchain/core/prompts");
require("dotenv").config();

const outputDirName = "sumit";
const baseDir = __dirname; // Assuming __dirname is the base directory for paths
const rawDataDir = path.join(baseDir, "output", outputDirName, "raw");
const finalOutputDir = path.join(baseDir, "output", outputDirName, "final");

// Ensure the final output directory exists
if (!fs.existsSync(finalOutputDir)) {
  fs.mkdirSync(finalOutputDir, { recursive: true });
}

// Example call to the function
// processPDFs(__dirname, outputDirName);
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE
  }
];

const accountDataPrompt = PromptTemplate.fromTemplate(
  template.promptTemplateHomePage
);
const statementDataPrompt = PromptTemplate.fromTemplate(
  template.promptTemplateALLPage
);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_KEY,
  safetySettings: safetySettings,
  maxOutputTokens: 8192
});

async function handlePDFStatements() {
  const pdfData = JSON.parse(
    fs.readFileSync(path.join(rawDataDir, "pdf-data.json"), "utf8")
  );
  let results = {};

  for (const pdf of pdfData) {
    console.log(`Processing ${pdf.name}...`);

    if (!results[pdf.name]) {
      results[pdf.name] = {
        pdf: pdf.name,
        account: {},
        statements: []
      };
    }

    // Handle account details from the first page
    try {
      const accountDetails = await handleDetails(
        pdf.content[0],
        accountDataPrompt
      );
      results[pdf.name].account = accountDetails;
      fs.writeFileSync(
        path.join(finalOutputDir, "results.json"),
        JSON.stringify(results, null, 2)
      );
    } catch (error) {
      console.error("Error handling account details:", error);
    }

    // Process and validate each statement detail individually
    for (let i = 0; i < pdf.content.length; i++) {
      const pageText = pdf.content[i];
      try {
        const statementDetails = await handleDetails(
          pageText,
          statementDataPrompt
        );
        if (statementDetails) {
          // Validate JSON data before pushing
          results[pdf.name].statements.push(statementDetails);
          fs.writeFileSync(
            path.join(finalOutputDir, "results.json"),
            JSON.stringify(results, null, 2)
          );
        }
      } catch (error) {
        console.error("Failed to process page data, moving to next:", error);
        // Optional: Attempt to split and process text if full page fails
        const parts = splitPageText(pageText);
        for (const part of parts) {
          try {
            const partialDetails = await handleDetails(
              part,
              statementDataPrompt
            );
            if (partialDetails) {
              results[pdf.name].statements.push(partialDetails);
              fs.writeFileSync(
                path.join(finalOutputDir, "results.json"),
                JSON.stringify(results, null, 2)
              );
            }
          } catch (error) {
            console.error("Failed to process part of the page:", error);
          }
        }
      }
    }
  }

  console.log("All PDF data processed and stored.");
}

function splitPageText(pageText) {
  // Simple logic to divide text into two parts, can be adjusted based on specific needs
  const midpoint = Math.floor(pageText.length / 2);
  return [pageText.substring(0, midpoint), pageText.substring(midpoint)];
}

async function handleDetails(pageText, promptTemplate) {
  const formattedPrompt = await promptTemplate.format({
    bank_statement_text: pageText
  });
  const chatResponse = await model.invoke([["human", formattedPrompt]]);

  let cleanResponse = chatResponse.text.replace(/```json|```/g, "").trim();
  console.log("cleanResponse", cleanResponse);
  try {
    // Assuming chatResponse.text is a JSON string, parse it to an object
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error("Failed to parse JSON:", cleanResponse);
    throw error;
  }
}

handlePDFStatements().catch((error) =>
  console.error("Error during PDF Statement handling:", error)
);
