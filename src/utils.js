"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anaysisImage = exports.anaysisTextLines = void 0;
require('dotenv').config();
const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const logic = {
    readTextFromFile: async (client, file) => {
        let result = await client.readInStream(file);
        // Operation ID is last path segment of operationLocation (a URL)
        let operation = result.operationLocation.split('/').slice(-1)[0];
        // Wait for read recognition to complete
        // result.status is initially undefined, since it's the result of read
        while (result.status !== "succeeded") {
            await sleep(1000);
            result = await client.getReadResult(operation);
        }
        return result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.
    },
    printRecText: (readResults) => {
        let textLines = [];
        for (const page in readResults) {
            if (readResults.length > 1) {
                console.log(`==== Page: ${page}`);
            }
            const result = readResults[page];
            if (result.lines.length) {
                for (const line of result.lines) {
                    const textLine = line.words.map((w) => w.text).join(' ');
                    textLines.push(textLine);
                }
            }
            else {
                console.log('No recognized text.');
            }
        }
        return textLines;
    }
};
const anaysisTextLines = async (textLines) => {
    let result;
    const openai = new OpenAIApi(configuration);
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a computer that extracts designated information from the receipt and return in valid JSON format."
                },
                {
                    role: "user",
                    content: `
          Find the total amount, merchant name, product items from the text lines and reutrn in JSON format.\n
          Here is an eaxmple of expected result: \n
          { 
              "total_amount": 123.99,
              "merchant_name": "Slack Technologies Limited",
              "items": [
                  {'name': 'item1', 'price': 1.99},
                  {'name': 'item2', 'price': 123.99},
              ]
          }
          text lines: ${textLines.join('\n')} 
          `
                }
            ]
        });
        result = JSON.parse(response.data.choices[0].message.content);
    }
    catch (e) {
        throw new Error('Failed to find the result for the text lines');
    }
    return result;
};
exports.anaysisTextLines = anaysisTextLines;
const anaysisImage = async (file) => {
    let textLines = [];
    try {
        const fileStream = await file.toBuffer();
        const endpoint = process.env.OCR_ENDPOINT;
        const apiKey = process.env.OCR_API_KEY;
        const computerVisionClient = new ComputerVisionClient(new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': apiKey, 'content-type': "application/octet-stream" } }), endpoint);
        const printedResult = await logic.readTextFromFile(computerVisionClient, fileStream);
        textLines = logic.printRecText(printedResult);
    }
    catch (e) {
        throw new Error("Failed to analyse the file");
    }
    return textLines;
};
exports.anaysisImage = anaysisImage;
