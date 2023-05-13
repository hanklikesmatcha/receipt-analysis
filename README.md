# OCR and Text Analysis Project

This project utilizes Azure's Cognitive Services and OpenAI's GPT-3.5 Turbo model to analyze and extract specific information from images of invoices and receipts. The aim is to identify purchased product items, the total amount, and the merchant name from the uploaded files. It provides an API endpoint for uploading an image file, extracting text from the image, and analyzing the text to obtain the desired information.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm installed on your machine. If you don't have these installed, you can follow the instructions [here](https://nodejs.org/en/download/).

### Installing

1. Firstly, clone the repository to your local machine:

```bash
git clone https://github.com/hanklikesmatcha/receipt-analysis.git
```

2. Navigate to the project directory and install dependencies:
```bash
cd your-repo-name
npm install
```
### Configuration
You need to provide the following environment variables:
```
OPENAI_API_KEY=Your OpenAI API key for accessing OpenAI's GPT-3.5 Turbo.
OCR_ENDPOINT=Your Azure OCR endpoint for accessing Azure's Optical Character Recognition (OCR) service.
OCR_API_KEY=Your Azure OCR API key.
```
These can be placed in a .env file at the root of your project.

### Running the Server
Run the server by executing the following command in your terminal. The server will start on port 8080:
```bash
npm start
```

### Usage
The server provides a single POST endpoint at /analyse for uploading an image file. The file should be included in the request body as multipart/form-data. The response will be a JSON object containing the result of the text analysis.

### Error Handling
The server and API functions include error handling. If an error occurs during the execution of any function, an error message will be returned in the response.