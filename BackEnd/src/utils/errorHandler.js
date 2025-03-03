const errorHandler = (res, error, message = 'Ocurrió un error') => {
  console.error(error);
  res.status(500).json({ message, error: error.message });
};

module.exports = errorHandler;
