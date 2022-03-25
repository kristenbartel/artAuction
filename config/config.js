<<<<<<< HEAD:config/config.json
{
  "production": {
    "username": "ohjyjzop",
    "password": "43MXSywJ3HrYbdlxEEvVCVItnLDU-J1G",
    "database": "ohjyjzop",
    "host": "kashin.db.elephantsql.com",
=======
require('dotenv').config();
module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
>>>>>>> 4a3388fe7686a699a6e57f78315b411d8a4723c9:config/config.js
    "dialect": "postgres"
  }
}


