import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const server = http.createServer(async (req, res) => {
  const url = req.url;
  const method = req.method;
  const publicPath = path.join(process.cwd(), "public");
  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
  };

  if (method === "GET") {
    let filePath;
    if (url === "/" || url === "/index.html") {
      filePath = path.join(publicPath, "index.html");
    } else if (url.startsWith("/public/")) {
      filePath = path.join(publicPath, url.replace("/public/", ""));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Sahifa topilmadi");
      return;
    }

    try {
      const fileContent = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(fileContent);
    } catch (error) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Fayl topilmadi");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Sahifa topilmadi");
  }
});

const PORT = 8000;
server.listen(PORT, () =>
  console.log(`Server http://localhost:${PORT} da ishlamoqda`)
);