import * as AWS from "aws-sdk";
import * as Config from "./Config";

interface Entry {
  key: string;
  lastModified: Date;
}

export class Storage {
  private static s3: AWS.S3;

  constructor() {
    if (Storage.s3 == null) {
      Storage.s3 = new AWS.S3(Config.S3);
    }
  }

  async get(key: string) {
    const res = await Storage.s3
      .getObject({
        Bucket: Config.S3_BUCKET,
        Key: key
      })
      .promise();
    return JSON.parse(res.Body as string);
  }

  async list(recursive: boolean, prefix?: string) {
    const param: AWS.S3.ListObjectsV2Request = {
      Bucket: Config.S3_BUCKET
    };
    if (prefix) {
      param.Prefix = prefix;
    }
    if (!recursive) {
      param.Delimiter = "/";
    }
    const res = await Storage.s3.listObjectsV2(param).promise();
    if (res.Contents) {
      const list = res.Contents.map<Entry>(value => {
        return {
          key: value.Key,
          lastModified: value.LastModified
        };
      });
      return list;
    }
  }
}

export default new Storage();
