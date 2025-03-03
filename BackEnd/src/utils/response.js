const successResponse = (res, data, message = 'Operación exitosa') => {
  res.status(200).json({ message, data });
};

module.exports = { successResponse };
