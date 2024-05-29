
const joi=require('joi');

const loginSchema=joi.object({
  email:joi.string().email().required(),
  password:joi.string().min(6).required()
});
const UserSchema = joi.object({
  id: joi.number().integer().positive(),
  firstname: joi.string().required(),
  lastname: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  isAdmin: joi.boolean().default(false),
  date_creation: joi.date().iso().default(new Date()),
  date_modification: joi.date().iso().default(new Date()).optional(),
  profile: joi.object().optional(), 
});
module.exports ={loginSchema,UserSchema}