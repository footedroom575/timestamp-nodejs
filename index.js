
// init project
var express = require('express');
var app = express();
let PORT = process.env.PORT || 3000

// enabled CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// does not validate all of the UTC patterns but recognizes most of them
function isValidDate(d) {
  if ((/[\d]{4}-[\d]{1,2}-[\d]{1,2}|[\d]+\s[\w]+\s[\d]+/).test(d)){
    return true
  }
  return d instanceof Date && !isNaN(d);
}

app.get("/api/:date", function (req, res) {
  let received = req.params.date
  
  // below checks are enough/considerable for the scope of project
  
  // in case the date is recieved as UTC format
  if (isValidDate(received) && !(/^[-|_][\d]+/g).test(received)){

    
    // running new Date twice so that even the strings that are not in UTC format before can be converted to the pure UTC format and hence, getTime() function will work
    let unix_ = new Date(new Date(received).toUTCString()).getTime()
    
    let utc_ = new Date(received).toUTCString()
    
    res.json({unix: unix_, utc: utc_})
  } else if (!received){
    
    // in case the date is not sent
    res.json({unix: parseInt(new Date().getTime()), utc: new Date().toUTCString()})

  } else if ((/[\d]+/g).test(received)){
    
    // in case of UNIX format date
    res.json({unix: parseInt(received), utc: new Date(parseInt(received)).toUTCString()})

  } else {

    res.json({"error": "Invalid Date"})

  }
});

// as per the FCC project demand
app.get("/api", (req, res)=>{
    // in case the date is not sent in parameters
    res.json({unix: parseInt(new Date().getTime()), utc: new Date().toUTCString()})
})


// listening for requests :)
var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
