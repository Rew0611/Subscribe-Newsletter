

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const First = req.body.first;
  const Last = req.body.last;
  const email = req.body.Email;
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: First,
          LNAME: Last,
        },
      },
    ],
  };
  var jsonData = JSON.stringify(data);
  const url = "https://us12.api.mailchimp.com/3.0/lists/3475f4a85b";
  const options = {
    method: "POST",
    auth: "rew:aaeda40fc1524f3f9213da409da4a163-us12",
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT||3000, function () {
  console.log("server is listening on port 3000");
});