//require installed node packages
const express = require("express");
const https = require("https");
const app = express();

//enable static files for use in express
app.use(express.static("public"));

//enable express to parse url-encoded body
app.use(express.urlencoded({
  extended: true
}));

//Routes
// get request for initial site load
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

// post request for submiting applicants name and email to mailchimp list
app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  }
  var jsonData = JSON.stringify(data);
  // The list id is your audience ID from Mailchimp
  const url = "https://us7.api.mailchimp.com/3.0/lists/listID";
  const options = {
    method: "POST",
    // Auth should be randomName of your choide then a : then the apiKey
    auth: "dane1:apiKey"
  }
  // function for redirecting different page based of a successful submit or not
  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();

});

// Button function to redirect back to the root
app.get("/failure", function(req, res){
  res.redirect("/");
});

app.get("/success", function(req, res){
  res.redirect("/");
});

// local host listening port 3000
app.listen(3000, function() {
  console.log("server is runniung on port 3000")
});
