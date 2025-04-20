import dotenv from 'dotenv';
import B2 from 'backblaze-b2';

dotenv.config();

const b2 = new B2({
    applicationKeyId: process.env.B2_KEY_ID,
    applicationKey: process.env.B2_SECRET_KEY,
});

export const uploadPost = async (file, foldername) => {
    try {
        await b2.authorize();
        const response = await b2.getUploadUrl({ bucketId: process.env.B2_BUCKET });
        const { authorizationToken, uploadUrl } = response.data;

        const params = {
            uploadUrl,
            uploadAuthToken: authorizationToken,
            fileName: `${foldername}/${Date.now() + file.originalname}`,
            data: file.buffer,
        };

        const fileInfo = await b2.uploadFile(params);

        return fileInfo.data;

    } catch (err) {
        console.error(err);
    }
};

export const getPost = async (fileName) => {
    try {
        await b2.authorize();

        const auth = await b2.getDownloadAuthorization({
            bucketId: process.env.B2_BUCKET,
            fileNamePrefix: fileName,
            validDurationInSeconds: 60 * 60 * 24, // valid for 24 hours
        });

        const fileUrl = `https://f005.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${fileName}?Authorization=${auth.data.authorizationToken}`;

        return fileUrl

    }
    catch (err) {
        console.log(err)
    }
}