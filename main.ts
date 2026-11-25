import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The entry image is drawn ahead of time and shipped in this repository.
// This program copies it to the grader's output directory, verifying on
// the way that the file it ships is exactly the file that was built:
// same byte count as the verified build, and a byte-identical copy.
const EXPECTED_BYTES = 149182;

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const src = new URL("./entry.png", import.meta.url);
const data = readFileSync(src);
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!data.subarray(0, 8).equals(PNG_SIGNATURE)) {
  throw new Error("entry.png does not start with a PNG signature");
}
if (data.length !== EXPECTED_BYTES) {
  throw new Error(
    `entry.png is ${data.length} bytes, expected ${EXPECTED_BYTES}`,
  );
}

const dst = join(outDir, "entry.png");
copyFileSync(src, dst);
const back = readFileSync(dst);
if (!back.equals(data)) {
  throw new Error("copied entry.png differs from the shipped file");
}
console.log(`wrote ${dst} (${back.length} bytes)`);
