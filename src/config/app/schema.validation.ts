import * as Joi from 'joi';

export const appConfigValidationSchema = Joi.object({
  ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required().default('localhost'),
  POSTGRES_PORT: Joi.number().required().default(3000),
  POSTGRES_USERNAME: Joi.string().required().default('postgres'),
  POSTGRES_PASSWORD: Joi.string().required().default('example'),
  POSTGRES_DB_NAME: Joi.string().required().default('teslostoredb'),
});
