export const C = {
  db: {
    path: "./db/lance",
    collectionName: "pdf_embeddings",
  },
  retrieval: {
    defaultNResults: 10,
    defaultDistanceMetric: "cosine",
  },
  embedding: {
    batchSize: 3,
  },
  pdfToPng: {
    workingDirectory: "./tmp",
  },
};
