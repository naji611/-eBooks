require("dotenv").config();

const { S3Client } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const Secret_access_key = process.env.Secret_access_key;
const Access_key = process.env.Access_key;
const Bucket_name = process.env.Bucket_name;
const Bucket_Region = process.env.Bucket_Region;
const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");
const S3 = new S3Client({
  credentials: {
    accessKeyId: Access_key,
    secretAccessKey: Secret_access_key,
  },
  region: Bucket_Region,
});

module.exports = {
  S3,
  randomImageName, // Export the function without invoking it
  Bucket_name,
};
