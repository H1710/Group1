<<<<<<< HEAD
    require('dotenv').config();
    const express = require('express');
    const configViewEngine = require('./config/viewEngine');
    const projectRoutes = require('./routes/project');
    const bodyParser = require('body-parser');
    const { notFound } = require('./middleware/handleErrors');
    const app = express();
    const cors = require('cors');
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
      }));
    configViewEngine(app);
    
    app.use('/api/v1/project/', cors(),projectRoutes);
    
    app.use('/',notFound);
    const port = 3000;
    
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}` )
        })
=======
require('dotenv').config();
const express = require('express');
const configViewEngine = require('./config/viewEngine');
const projectRoutes = require('./routes/project');
const bodyParser = require('body-parser');
const { notFound } = require('./middleware/handleErrors');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
configViewEngine(app);

app.use('/api/v1/project/', projectRoutes);

app.use('/',notFound);
const port = 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    })
>>>>>>> 13e7444e3c5f145f3dbf7a7050dcedb7020198f5
