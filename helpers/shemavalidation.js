
const joi=require('joi');

const loginSchema=joi.object({
  email:joi.string().email().required(),
  password:joi.string().min(6).required()
});
const UserSchema = joi.object({
  firstname: joi.string().required(),
  lastname: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  isAdmin:joi.boolean()
});
const postIdSchema=joi.number().required();

const profileSchema = joi.object({
  sexe: joi.string().valid('M', 'F').optional().messages({
      'any.only': 'Le sexe doit être "M" ou "F"'
  }),
  pays: joi.string().pattern(/^[a-zA-Z\s]*$/).optional().messages({
      'string.pattern.base': 'Le pays ne doit contenir que des lettres'
  }),
  ville: joi.string().pattern(/^[a-zA-Z\s]*$/).optional().messages({
      'string.pattern.base': 'La ville ne doit contenir que des lettres'
  })
});
module.exports ={loginSchema,UserSchema,postIdSchema,profileSchema}