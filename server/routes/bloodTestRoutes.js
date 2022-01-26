const AWS = require('aws-sdk');

module.exports = (app) => {

    app.get(
        '/all-tests',
        (req, res) => {
            s3 = new AWS.S3();

            AWS.config.update({ region: 'US-EAST-1' });

            let params = {
                Bucket: 's3.helloheart.home.assignment',
                Key: 'bloodTestConfig.json'
            };

            s3.makeUnauthenticatedRequest(
                'getObject',
                params,
                (err, data) => {
                    if (!err) {
                        let bloodtests = JSON.parse(data.Body).bloodTestConfig;
                        res.send(bloodtests);
                    }
                }
            );
        }
    );
};
