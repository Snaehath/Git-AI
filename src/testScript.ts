import { generateCommitMessage } from "./ai";

const fakeDiff = `
diff --git a/server.js b/server.js
index abcd123..ef45678 100644
--- a/server.js
+++ b/server.js
@@ -20,7 +20,11 @@
 app.get('/status', (req, res) => {
-  res.send('OK');
+  console.log("Status endpoint hit");
+  res.status(200).json({ status: "OK", uptime: process.uptime() });
 });
`;

(async () => {
  const message = await generateCommitMessage(fakeDiff);
  console.log("Generated Commit Message:", message);
})();
