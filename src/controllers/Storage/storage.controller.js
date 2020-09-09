/* eslint-disable consistent-return */
import aws from 'aws-sdk';
import uniqueString from 'unique-string';

const { S3_BUCKET } = process.env;
aws.config.region = 'us-west-2';

export default function installStorageRoute(router) {
  router.get('/api/sign-s3', (req, res) => {
    const s3 = new aws.S3();
    const uniqueImageID = uniqueString();
    const fileType = req.query['file-type'];
    const fileSize = req.query['file-size'];
    const FOLDER = 'user-content';
    const s3Params = {
      Bucket: `${S3_BUCKET}/${FOLDER}`,
      Key: uniqueImageID,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read',
    };

    if (!fileType.match(RegExp(/image\//))) {
      return res.status(500).json({ message: 'Only accept image.' });
    }

    if (!fileSize || fileSize >= 3000000) {
      return res.status(500).json({ message: 'File size exceeded limit.' });
    }

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).end();
      }

      const returnData = {
        imageUid: uniqueImageID,
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${FOLDER}/${uniqueImageID}`,
      };
      res.json(returnData);
    });
  });

  return router;
}
