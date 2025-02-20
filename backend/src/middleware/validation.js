const Joi = require('joi');

const contractSchema = Joi.object({
  type: Joi.string().valid('service_agreement', 'nda', 'employment').required(),
  parameters: Joi.object().required(),
});

const validateContract = (req, res, next) => {
  const { error } = contractSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateContract,
};
