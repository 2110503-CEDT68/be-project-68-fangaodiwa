const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db.js");
const mongoSenitize = require('@exortek/express-mongo-sanitize');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// routes
const hospitals = require("./routes/hospitals.js");
const auth = require("./routes/auth.js");
const appointments = require("./routes/appointments.js");

dotenv.config({
    path: "./config/config.env"
})

connectDB();

app.set('query parser', 'extended');

const limiter = rateLimit({
    windowsMs: 10 * 60 * 1000,
    max: 100
});

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Library API',
            version: '1.0.0',
            description: 'A simple Express VacQ API'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}/api/v1`
            }
        ]
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use([
    express.json(),
    cookieParser(),
    mongoSenitize(),
    helmet(),
    xss(),
    limiter
]);

app.use("/api/v1/hospitals", hospitals);
app.use("/api/v1/auth", auth);
app.use("/api/v1/appointments", appointments);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV;

const server = app.listen(PORT, console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`))

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);

    server.close(() => process.exit(1));
})