import { serve } from "bun";
import { join } from "path";
import { statSync, existsSync, writeFileSync } from "fs";
import fetch from "node-fetch";

const server = serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    let filePath = join("public", url.pathname);

    try {
      const fileStat = statSync(filePath);

      if (fileStat.isDirectory()) {
        filePath = join(filePath, "index.html");
      }

      if (existsSync(filePath)) {
        return new Response(Bun.file(filePath));
      } else {
        return new Response("Not Found", { status: 404 });
      }
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  },
});

const xmlUrl = "https://xmltv.tvkaista.net/guides/telsu.fi.xml";
const xmlFilePath = join("public", "tv.xml");

// Fetch and save the XML data
async function fetchAndSaveXML() {
  try {
    const response = await fetch(xmlUrl);
    const data = await response.text();
    writeFileSync(xmlFilePath, data);
    console.log("XML data saved to", xmlFilePath);
  } catch (error) {
    console.error("Error fetching XML data:", error);
  }
}

// Fetch and save the XML data when the server starts
fetchAndSaveXML();


console.log("Server running on http://localhost:3000");