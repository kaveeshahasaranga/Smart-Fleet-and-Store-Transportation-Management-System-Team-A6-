import 'dotenv/config';

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  devMasterDataAccess: process.env.DEV_MASTER_DATA_ACCESS === 'true',
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI,
};
