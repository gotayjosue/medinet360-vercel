const { body, validationResult } = require('express-validator');

const validate = {};

validate.appointmentValidationRules = () => {
  return [
    body('patientId')
    .notEmpty().withMessage('Patient name is required'),
    body('date')
    .notEmpty().withMessage('Date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format (e.g., 1998-11-17)'),
    body('hour')
    .notEmpty().withMessage('Hour is required'),
    body('duration').notEmpty().withMessage('Duration is required'),
  ];
};

validate.check = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validate;