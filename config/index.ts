const appConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret',
    expiresIn: "15m",
    refreshExpiresIn: '7d',
  },
};

export default appConfig;
