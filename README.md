# semantic-image-search

A super simple command line utility to embed PDF files as images with CLIP, store them in a vector store, and then find the most similar PDFs and pages of PDFs with an image as input. Supports adding all PDFs in a folder or just a single PDF at a time.

## Setup

- `cp env.example .env`, check the values
- `npm run install`
- Ensure you have PDM installed on your system (macOS: `brew install pdm`)
- `cd src/python-clip && pdm install && cd ../..`

### Development

- `npm run dev`

## Usage

Ensure the setup is done.

### CLI

...
