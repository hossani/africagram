const joi=require('joi');

const UserSchema = joi.object({
    firstname: joi.string().messages({
      'string.base': 'first name doit etre une chaine de character.'
    }),
    lastname: joi.string().messages({
        'string.base': 'last name doit etre une chaine de character.'
    }),
    email: joi.string().email().messages({
      'string.email': 'Veuillez fournir un email valide.',
    }),
    password: joi.string().min(6).messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères.',
    }),
    isAdmin: joi.boolean().messages({
      'boolean.base': 'La valeur de isAdmin doit être un booléen.'
    })
  });

  module.exports=UserSchema;