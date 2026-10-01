/**
 * Run: node --experimental-strip-types --test src/lib/trackingScripts.test.ts
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { parseHeadScripts } from "./trackingScripts.ts";

test("inline script, external script and bare JavaScript are all recognised", () => {
  assert.deepEqual(parseHeadScripts("<script>window.a=1</script>"), [{ code: "window.a=1" }]);
  assert.deepEqual(parseHeadScripts('<script async src="https://x.test/a.js"></script>'), [
    { src: "https://x.test/a.js", async: true, defer: false },
  ]);
  assert.deepEqual(parseHeadScripts("window.b=2"), [{ code: "window.b=2" }]);
});

test("markup that is not a script is skipped for the head", () => {
  assert.deepEqual(parseHeadScripts('<noscript><iframe src="x"></iframe></noscript>'), []);
});
