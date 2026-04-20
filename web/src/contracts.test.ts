import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, it, expect } from "vitest";

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(ts|tsx)$/.test(full)) yield full;
  }
}

const useServerFiles = [...walk("src")].filter((f) => {
  const src = readFileSync(f, "utf8").trimStart();
  return src.startsWith('"use server"') || src.startsWith("'use server'");
});

describe('"use server" files only export async functions', () => {
  for (const file of useServerFiles) {
    it(file, async () => {
      const mod = await import(pathToFileURL(resolve(file)).href);
      for (const [name, value] of Object.entries(mod)) {
        expect(
          (value as { constructor?: { name?: string } })?.constructor?.name,
          `${file}: export '${name}' must be an AsyncFunction`,
        ).toBe("AsyncFunction");
      }
    });
  }
});
