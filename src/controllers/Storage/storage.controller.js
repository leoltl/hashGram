/* eslint-disable consistent-return */
import aws from 'aws-sdk';

const { S3_BUCKET } = process.env;
aws.config.region = 'us-west-2';

export default function installStorageRoute(router) {
  router.get('/api/sign-s3', (req, res) => {
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const FOLDER = 'user-content';
    const s3Params = {
      Bucket: `${S3_BUCKET}/${FOLDER}`,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read',
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).end();
      }

      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${FOLDER}/${fileName}`,
      };
      res.json(returnData);
    });
  });

  return router;
}
