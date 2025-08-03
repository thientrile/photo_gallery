


// // config.js
// import dotenv from "dotenv";
require('dotenv').config();

const ENV = process.env.NODE_ENV || "local";
console.log("NODE_ENV :::", ENV);

// Helper function để load biến có prefix theo env
const getEnv = (key, fallback) => {
  const fullKey = `${ENV.toUpperCase()}_${key}`;
  return process.env[fullKey] || process.env[key] || fallback;
};

const config = {
  app: {
    name: process.env.APP_NAME || "APP_CHAT",
    version: process.env.VERSION || "1.0.0",
    description: process.env.DESCRIPTION || "This is a sample application configuration file.",
    port: parseInt(process.env.PORT, 10) || (ENV === "local" ? 3089 : 3000),
    host: process.env.HOST || "localhost",
  },

  mongodb: {
    schema: getEnv("DB_CONNECTION", "mongodb"),
    user: getEnv("DB_USER", "root"),
    pass: getEnv("DB_PASSWORD", "123456"),
    host: getEnv("DB_HOST", "localhost:27017"),
    database: getEnv("DB_NAME", "AppChat"),
    options: {
      authSource: "admin",
    },
    
  },
  jwt: {
    secret: process.env.JWT_SECRET || "s3cr3t_k3y_ThienTri_2025_🔥",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
  },
};

module.exports = config;
