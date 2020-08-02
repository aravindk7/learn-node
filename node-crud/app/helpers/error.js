class ErrorHandler extends Error {
    constructor(statusCode, message) {
      super();
      this.statusCode = statusCode;
      this.message = message;
    }
  }

  const handleError = (err, res) => {
    const { statusCode, message } = err;
    res.status(statusCode || 404).json({
      status: "error",
      statusCode: statusCode || 404,
      message
    });
  };

  module.exports = {
    ErrorHandler,
    handleError
  };