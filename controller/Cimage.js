const AWS = require('aws-sdk');
const { User } = require('../models');

AWS.config.update({
    region: 'ap-northeast-2',
});

const s3 = new AWS.S3();

const getS3ImageURL = async (req, res) => {
    const filename = req.params.filename;
    const params = {
        Bucket: 'kdt-test-bucket-seunggi',
        Key: filename,
    };

    try {
        const data = await s3.getObject(params).promise();
        const imageBase64 = data.Body.toString('base64');
        const imageSrc = `data:${data.ContentType};base64,${imageBase64}`;
        res.send(imageSrc);
    } catch (err) {
        console.error(err);
        res.status(500).send('S3 이미지 가져오기 에러');
    }
};

const getProfileImage = async (userId) => {
    try {
        const user = await User.findOne({ where: { user_id: userId } });

        if (user && user.profileImageFilename) {
            const params = {
                Bucket: 'kdt-test-bucket-seunggi',
                Key: user.profileImageFilename,
            };

            const data = await s3.getObject(params).promise();
            const imageBase64 = data.Body.toString('base64');
            const imageSrc = `data:${data.ContentType};base64,${imageBase64}`;

            return imageSrc;
        } else {
            return '/public/images/default-profile-image.png';
        }
    } catch (error) {
        console.error('프로필 이미지 가져오기 에러:', error);
        throw error;
    }
};

module.exports = {
    getS3ImageURL,
    getProfileImage
};
