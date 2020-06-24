const AppError = require("../classes/app-error");

module.exports = {
  DB_CONNECT_ERR: "DB_CONNECT_ERR",

  PLATE_EXISTS: "PLATE_EXISTS",

  HTTP_BAD_REQUEST: new AppError(400, 'Bad Request'),

  HTTP_NOT_FOUND: new AppError(404, 'Not Found'),

  HTTP_INTERNAL_SERVER: new AppError(500, 'Internal Server Error'),

};
