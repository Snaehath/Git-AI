import { generateCommitMessage } from "./ai";

const fakeDiff = `
diff --git a/utils.js b/utils.js
index 1a2b3c4..5d6e7f8 100644
--- a/utils.js
+++ b/utils.js
@@ -10,7 +10,9 @@
-function calculateSum(a, b) {
-  return a + b;
+function calculateTotal(a, b, log = false) {
+  const total = a + b;
+  if (log) console.log("Total:", total);
+  return total;
 }
 
 module.exports = { calculateTotal };
`;

(async () => {
  const message = await generateCommitMessage(fakeDiff);
  console.log("Generated Commit Message:", message);
})();
