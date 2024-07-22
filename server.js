const http = require("http"),
  url = require("url"),
  fs = require("fs");

http
  .createServer((request, response) => {
    let addr = request.url,
      q = new URL(addr, "http://localhost:8080"),
      filePath = " ";
    if (q.pathname.includes("documentation")) {
      filePath = __dirname + "/documentation.html";
    } else {
      filePath = "index.html";
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }

      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    });

    fs.appendFile(
      "log.txt",
      "URL: " + addr + "\nTimestamp: " + new Date() + "\n\n",
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Added to Log.");
        }
      }
    );
  })
  .listen(8080);
console.log("It's working!");