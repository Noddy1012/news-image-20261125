// The image for 25 November 2026 is drawn ahead of time and kept in this
// repository. This program copies it into the grader's output folder and
// checks, before and after the copy, that it is the exact file that was
// verified: a PNG of the expected size, copied byte for byte. The image
// itself is built by make_image.py, which lives outside this repository;
// only the finished PNG ships here, so the program's job is to copy it
// faithfully and refuse to run with anything else.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const EXPECTED_SIZE = 149182;
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });

const shipped = readFileSync(new URL("./entry.png", import.meta.url));
if (shipped.length !== EXPECTED_SIZE) {
  throw new Error(`entry.png is ${shipped.length} bytes, expected ${EXPECTED_SIZE}`);
}
const head = [...shipped.subarray(0, 8)];
if (head.join(",") !== PNG_MAGIC.join(",")) {
  throw new Error("entry.png does not begin with the PNG magic bytes");
}

const target = resolve(outputDir, "entry.png");
writeFileSync(target, shipped);
const written = readFileSync(target);
if (!written.equals(shipped)) {
  throw new Error("the written entry.png is not the shipped file");
}
console.log(`entry.png written to ${target} (${written.length} bytes)`);
