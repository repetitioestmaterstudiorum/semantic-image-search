import * as lancedb from "@lancedb/lancedb";
import { C } from "./constants.js";
import crypto from "crypto";
import { createLogger } from "./logger.js";
import * as arrow from "apache-arrow";

const log = createLogger();

const db = await lancedb.connect(C.db.path);

async function ensureTable() {
  const tableNames = await db.tableNames();
  if (!tableNames.includes(C.db.collectionName)) {
    const schema = new arrow.Schema([
      new arrow.Field("id", new arrow.Utf8()),
      new arrow.Field("fileName", new arrow.Utf8()),
      new arrow.Field("pageNumber", new arrow.Int32()),
      new arrow.Field(
        "vector",
        new arrow.FixedSizeList(
          768,
          new arrow.Field("item", new arrow.Float32())
        )
      ),
    ]);
    await db.createEmptyTable(C.db.collectionName, schema);
    log.debug("Created table", C.db.collectionName);
  }
}

export async function insertOne({ vector, fileName, pageNumber }) {
  const id = crypto.randomUUID();
  const table = await db.openTable(C.db.collectionName);
  table.add([{ id, vector, fileName, pageNumber }]);
  log.info("Inserted embedding", { id });
}

export async function findSimilar({ vector, nResults }) {
  const table = await db.openTable(C.db.collectionName);
  const results = await table
    .vectorSearch(vector)
    .distanceType(C.retrieval.defaultDistanceMetric)
    .limit(nResults)
    .select(["id", "fileName", "pageNumber"])
    .toArray();
  return results;
}

export async function dropTable() {
  await db.dropTable(C.db.collectionName);
  await ensureTable();
  log.info("Dropped table", C.db.collectionName);
}

await ensureTable();
