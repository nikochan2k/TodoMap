import * as AWS from "aws-sdk";

export const S3_BUCKET = "test";

export const S3: AWS.S3.ClientConfiguration = {
  accessKeyId: "MYH185WM5MW2PPQG9YK9",
  secretAccessKey: "S9Pmlp3+YiYeaGWj9GRJ1czwIbLqkVUGxreajm8d",
  endpoint: "http://127.0.0.1:9000",
  s3ForcePathStyle: true,
  signatureVersion: "v4"
};
