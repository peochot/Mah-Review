import mongoose from "mongoose";
import chalk from "chalk";

mongoose.Promise = require('bluebird');
let url = "mongodb://localhost:27017/mern";
if (process.env.PORT) {
    url = "mongodb://mahteam:mahteam@ds033976.mlab.com:33976/heroku_xb01qh9s";
}

mongoose.connect(url);

mongoose.connection.on('connected', () => {
    console.log('%s MongoDB connection established!', chalk.green('✓'));
});
mongoose.connection.on('error', () => {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});
export default mongoose
