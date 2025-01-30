const User = require("../models/user.model");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { S3, Bucket_name } = require("../util/awsClient");
exports.userProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const getObjectParams = {
      Bucket: Bucket_name,
      Key: user.imageName,
    };
    const command = new GetObjectCommand(getObjectParams);
    const Url = await getSignedUrl(S3, command, { expiresIn: 10800 });
    res.status(200).json({
      userName: user.username,
      email: user.email,
      profileImage: Url,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    next();
  }
};
