import { FileLoader } from 'ckeditor5';
import { storage } from '../../utils/appwrite.ts';
import { ID } from 'appwrite';
import { message } from 'antd';
import { BucketName } from '../../../types/enums.ts';

export class UploadAdapter {
    loader: FileLoader; // 明确类型声明
    constructor(loader: FileLoader) { // 修改参数类型为FileLoader
        this.loader = loader;
    }

    upload() {
        return new Promise<{ uploaded: boolean; default: string }>(async (resolve, reject) => {
            const file = await this.loader.file;
            if (file) {
                try {
                    const fileInfo = await storage.createFile(
                        BucketName.chapter,
                        ID.unique(),
                        file,
                    );
                    const fileContent = storage.getFileView(fileInfo.bucketId, fileInfo.$id);
                    resolve({
                        uploaded: true, // 添加CKEditor期望的uploaded字段
                        default: fileContent,
                    });
                } catch (e: any) {
                    reject(e);
                    message.error(e.message);
                }
            }
        });
    }

    abort() {
        this.loader.abort();
    }
}