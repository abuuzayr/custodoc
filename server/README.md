# Project CustoDoc App Server

## Guide 
#### Installing Packages
Before you start, navigate inside `custodoc/server/` folder and run command `npm install`
#### Start Server
To start server, run command `node server.js`
#### API and Routing
**Coventions:**
   
- Name all folders in lower case
- Organize your APIs and middleware functions in folder by feature (e.g `autofill`,`entrymgmt`)

##### Create your modules 
- Start creating your module by creating folder under path `custodoc/server/routes/your_module_folder here`
- Inside your module folder create `index.js`
- Put routes inside `your_module_folder/index.js` 
  
  ```javascript
  // For Example my module name is autofill
  // Under .../server/routes/autofill
  
  // in .../autofill/index.js
  const autofill = require('express').Router();
  autofill.route('/your_path/:your_param')
          .get(function(req,res,next){...})
          .post(function(req,res,next{...});
          //...
  module.export = autofill        
  ```


##### Put together
- After you created and exported your module, import your module in `routes\index.js`.

```javascript
//import your module
const autofill = require('./autofill'); //will look for ./autofill/index.js
//add route to your module
routes.use('/autofill', autofill);
```

##### Token Authentication

If you are integrating Token Authentication to your code, import module `...server\utils\403.js`
```javascript
//for example

//Import authentication module
const Auth = require('../../utils/403.js')();
//Autenticate token for every http request sent to autofill module
autofill.use(function(req,res,next){ Auth.authenticateToken(req,res,next)});
```

**Test your authentication path**
For testing purpose, generate a toke using `server\_jwttest.js`. Run `node _jwttest.js` and copy the generated token. Note that the token is valid only for 24 hours.

Use postman (in Chrome) to send http request with token. Test your authentication path by sending request with header `X-Access-Token` and set its value to your token.


