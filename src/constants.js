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
    batchSize: 20,
  },
  pdfToPng: {
    workingDirectory: "./tmp",
  },
  pythonApi: {
    url: `http://localhost:${process.env.PORT || 8000}`,
  },
};
