## Guide 
####Installing Packages
Before you start, navigate inside `custodoc/server/` folder and run command `npm install`
####Start Server
To start server, run command `node server.js`
#### API and Routing
**Coventions:**
   
- Name all folders in lower case
- Organize your APIs and middleware functions in folder by feature (e.g `autofill`,`entrymgmt`)

##### Create your modules 
- Start creating your module by creating folder under path `custodoc/server/routes/your_module_folder here`
- Inside your module folder create `index.js`
- Put routes inside `your_module_folder/index.js` 
  
  ```
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

```
//import your module
const autofill = require('./autofill'); //will look for ./autofill/index.js
//add route to your module
routes.use('/autofill', autofill);
```
