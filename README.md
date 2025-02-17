# semantic-image-search

A super simple command line utility to embed PDF files as images with CLIP, store them in a vector store, and then find the most similar PDFs and pages of PDFs with an image as input. Supports adding all PDFs in a folder or just a single PDF at a time.

## PoC Status

This is a PoC only, to check how well RAG over PDFs containing images works when retrieving based on an image contained in those PDF files, using CLIP as embedding model.

Very much not for production.

## Setup

This has been built on a macOS with M2 processor. Not tested in other environments.

- `cp env.example .env`, check the values
- Ensure Node.js is installed (see .nvmrc for the version)
- `npm i`
- Ensure you have PDM installed on your system (macOS: `brew install pdm`)
- `pdm python install 3.13`
- `cd src/python_clip && pdm install && cd ../..`

### Development

- `npm run dev`

Note: Changes to the python file will require a manual reload. Nodemone is used for Node.js.

## Usage

- Ensure the setup is done.
- `npm start`

### CLI

The CLI provides the following commands:

- `add-folder <folderPath>` - Add all PDFs from a folder
- `add-pdf <pdfPath>` - Add a single PDF file
- `retrieve <imagePath> [numberOfResults]` - Find similar PDFs using an image (optional: specify number of results)
- `reset-db` - Reset the database
- `help` - Show available commands
