export const C = {
  db: {
    path: "./db/lance",
    collectionName: "pdf_embeddings",
  },
  retrieval: {
    defaultNResults: 5,
  },
  embedding: {
    batchSize: 3,
  },
  pdfToPng: {
    workingDirectory: "./tmp",
  },
};
