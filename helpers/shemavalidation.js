
const joi=require('joi');

const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    'string.email': 'Veuillez fournir un email valide.',
    'any.required': 'L\'email est obligatoire.'
  }),
  password: joi.string().min(6).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 6 caractères.',
    'any.required': 'Le mot de passe est obligatoire.'
  })
});


const UserSchema = joi.object({
  firstname: joi.string().required().messages({
    'any.required': 'Le prénom est obligatoire.'
  }),
  lastname: joi.string().required().messages({
    'any.required': 'Le nom de famille est obligatoire.'
  }),
  email: joi.string().email().required().messages({
    'string.email': 'Veuillez fournir un email valide.',
    'any.required': 'L\'email est obligatoire.'
  }),
  password: joi.string().min(6).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 6 caractères.',
    'any.required': 'Le mot de passe est obligatoire.'
  }),
  isAdmin: joi.boolean().messages({
    'boolean.base': 'La valeur de isAdmin doit être un booléen.'
  }),
  phoneNumber: joi.string().pattern(/^\+2126\d{8}$/).required().messages({
    'string.pattern.base': 'Le numéro de téléphone doit être au format valide.',
    'any.required': 'Le numéro de téléphone est obligatoire.'
  })
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