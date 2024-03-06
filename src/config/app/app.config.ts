export const AppEnvConfiguration = () => ({
  environment: process.env.ENV || 'development',
  port: process.env.PORT || 3000,
  postgresHost: process.env.POSGRES_HOST || 'localhost',
  postgresPort: process.env.POSTGRES_PORT || 3000,
  postgresUsername: process.env.POSTGRES_USERNAME || 'postgres',
  postgresPassword: process.env.POSTGRES_PASSWORD || 'example',
  postgresDbName: process.env.POSTGRES_DB_NAME || 'teslostoredb',
});
