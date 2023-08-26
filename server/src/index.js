require('dotenv').config();
const express = require('express');
// const cors = require('cors');
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');
const projectRoutes = require('./routes/project');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
configViewEngine(app);

app.use('/', webRoutes);
app.use('/api/v1/project/', projectRoutes);

// app.use('/', (req, res) => {
//     console.log('hello');
//     res.send('Hello');
// })
const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    })
