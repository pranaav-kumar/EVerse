const express = require("express");
const app = express();

app.get("/test", (req, res) => {
  res.send("✅ Minimal test route is working");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
