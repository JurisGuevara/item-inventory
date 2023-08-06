'use strict';
const express = require('express');
const config = require('./config');
const cors = require('cors');
const bodyParser = require('body-parser');

const loginRoutes = require('./routes/loginRoutes');
const addItemRoutes = require('./routes/addItemRoutes');
const addSetRoutes = require('./routes/addSetRoutes');
const itemListRoutes = require('./routes/itemListRoutes');
const setListRoutes = require('./routes/setListRoutes');
const setDetailsListRoutes = require('./routes/setDetailsListRoutes');
const getSelectRoutes = require('./routes/getSelectRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api', loginRoutes.routes);
app.use('/api', addItemRoutes.routes);
app.use('/api', addSetRoutes.routes);
app.use('/api', itemListRoutes.routes);
app.use('/api', setListRoutes.routes);
app.use('/api', setDetailsListRoutes.routes);
app.use('/api', getSelectRoutes.routes);

app.listen(config.port, () => {
  console.log('app listening on url http://'+ config.host + ':' + config.port )
});