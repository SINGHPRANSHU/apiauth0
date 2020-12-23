// server.js

const express = require('express');
const app = express();
const cors =require('cors');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
var request = require("request");
app.use(cors());
require('dotenv').config()
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;
app.use(bodyParser.json());          
app.use(bodyParser.urlencoded({
  extended: true
}));
// Authorization middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and 
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri:process.env.jwksUri
  }),

  // Validate the audience and the issuer.
  audience:process.env.audience,
  issuer: process.env.issuer,
  algorithms: ['RS256']
});


app.get('/api/public', function(req, res) {
    

    res.json({
      message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
    });
  });
  
  // This route needs authentication
  app.get('/api/private', checkJwt, function(req, res) {
      console.log(req.user);
    res.json({
      message: 'Hello from a private endpoint! You need to be authenticated to see this.'
    }).status(200);
  })


const checkScopes = jwtAuthz(["read:messages"],{customScopeKey:"permissions"});

app.get('/api/privatescoped', checkJwt, checkScopes, function(req, res) {
   
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.',
    
  }).status(200);
});




app.listen(PORT,()=>console.log('on 3001'));