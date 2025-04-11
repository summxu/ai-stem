import { Button, Upload, message } from 'antd';
import React, { useState } from 'react';
import { Interaction } from '../../../types/db';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { storage } from '../../utils/appwrite.ts';
import { BucketName } from '../../../types/enums.ts';
import { ID } from 'appwrite';

interface FileInteractionProps {
    data: Interaction;
    isSubmitted: boolean;
    onSubmit: (answer: string, isCorrect: boolean) => void;
}

const FileInteraction: React.FC<FileInteractionProps> = ({ isSubmitted, onSubmit }) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    // 文件上传题目没有标准答案，只要提交了文件就视为完成
    const handleSubmit = () => {
        if (fileList.length > 0) {
            // 传递文件名作为答案，文件上传题不判断对错
            const fileNames = fileList.map(file => file.name).join(',');
            onSubmit(fileNames, true);
        } else {
            message.error('请先上传文件');
        }
    };

    const uploadProps: UploadProps = {
        onRemove: file => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        customRequest: async ({ file }) => {
            const customFile = file as unknown as File;
            try {
                // 还未添加权限
                const { bucketId, $id } = await storage.createFile(BucketName.leaning, ID.unique(), customFile);
                const fileContent = storage.getFileView(bucketId, $id);
                const tempUploadFile = fileList.map(f => {
                    // @ts-ignore
                    if (f.uid === file.uid) {
                        f.url = fileContent;
                        f.uid = $id;
                    }
                    return f;
                });
                setFileList(tempUploadFile);
            } catch (e) {
                message.error((e as Error).message);
            }
        },
        beforeUpload: file => {
            setFileList([...fileList, file]);
        },
        listType: 'picture',
        fileList,
        disabled: isSubmitted,
    };

    return (
        <div>
            <Upload {...uploadProps}>
                {!isSubmitted && <Button icon={<UploadOutlined />}>
                  选择文件
                </Button>}
            </Upload>

            {!isSubmitted && fileList.length > 0 && (
                <div style={{ marginTop: 16 }}><Button type="primary" onClick={handleSubmit}> 确认答案 </Button></div>
            )}
        </div>
    );
};

export default FileInteraction;