const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

require('./routes/bloodTestRoutes')(app);

app.listen(PORT);