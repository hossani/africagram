const BadRequestError=require('./bad-request');
const NotFoundError=require('./not-found');
const UnauthenticatedError=require('./unauthenticated');
const ConflictError=require('./conflict-error');
const ForbiddenError=require('./forbidden');

module.exports={BadRequestError,NotFoundError,UnauthenticatedError,ConflictError,ForbiddenError}