import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { Client } from '@elastic/elasticsearch';

const index = 'michelin';
const NDJSON_FILE = `./${index}.ndjson`;

async function main() {
  const client = new Client({
    node: 'http://localhost:9200',
  });

  const batch: unknown[] = [];
  let totalCopied = 0;

  const fileStream = createReadStream(NDJSON_FILE);
  const rl = createInterface({
    crlfDelay: Infinity,
    input: fileStream,
  });

  for await (const line of rl) {
    if (!line.trim()) continue;

    const lineParsed: unknown = JSON.parse(line);

    batch.push(lineParsed);
  }

  const bulkResponse = await client.bulk({
    body: batch,
    index,
    refresh: true,
  });

  if (bulkResponse.errors) {
    console.error(
      'Bulk errors:',
      bulkResponse.items
        .filter((item) => item.index?.error)
        .map((item) => item.index?.error),
    );
  }

  totalCopied += batch.length / 2;
  console.log(`Copied ${totalCopied} documents...`);
}

main().catch((error) => {
  console.error(error);
});
