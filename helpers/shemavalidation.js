
const joi=require('joi');

const loginSchema=joi.object({
  email:joi.string().email().required(),
  password:joi.string().min(6).required()
});
const UserSchema = joi.object({
  firstname: joi.string().required(),
  lastname: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required()
});
module.exports ={loginSchema,UserSchema}