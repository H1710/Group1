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
    console.log(`Example app listening on port ${port}`)
    })
