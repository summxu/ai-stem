import { Button, Upload, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Interaction } from '../../../types/db';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { storage } from '../../utils/appwrite.ts';
import { BucketName } from '../../../types/enums.ts';
import { ID } from 'appwrite';

interface FileInteractionProps {
    data: Interaction;
    isSubmitted: boolean;
    onSubmit: (answer: string[]) => void;
    savedAnswer?: string[];
    disabled?: boolean;
}

const FileInteraction: React.FC<FileInteractionProps> = ({ isSubmitted, onSubmit, savedAnswer, disabled = false }) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    // 文件上传题目没有标准答案，只要提交了文件就视为完成
    const handleSubmit = () => {
        if (fileList.length > 0) {
            onSubmit([fileList[0].url!]);
        } else {
            message.error('请先上传文件');
        }
    };

    // 初始化时如果有保存的答案，显示文件名信息
    useEffect(() => {
        if (savedAnswer && savedAnswer.length > 0) {
            // 从savedAnswer中提取文件名，创建模拟的文件列表
            const mockFileList = savedAnswer.map((name, index) => ({
                uid: `-${index}`,
                name,
                status: 'done',
                url: name, // 没有实际URL，只显示文件名
            })) as UploadFile[];
            setFileList(mockFileList);
        }
    }, [savedAnswer]);

    const uploadProps: UploadProps = {
        onRemove: file => {
            if (isSubmitted || disabled) return;
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        customRequest: async ({ file, onSuccess, onError }) => {
            const customFile = file as unknown as File;
            try {
                // 还未添加权限
                const { bucketId, $id } = await storage.createFile(BucketName.leaning, ID.unique(), customFile);
                const fileContent = storage.getFileView(bucketId, $id);
                // 更新文件信息
                const updatedFile = {
                    uid: $id,
                    name: customFile.name,
                    status: 'done',
                    url: fileContent
                } as any;

                // 通知上传成功
                onSuccess?.(updatedFile, new XMLHttpRequest());
                setFileList([updatedFile]);
            } catch (e) {
                onError?.(e as Error);
                message.error((e as Error).message);
            }
        },
        listType: 'picture',
        fileList,
        disabled: isSubmitted || disabled,
    };

    return (
        <div>
            <Upload {...uploadProps}>
                {!isSubmitted && !disabled && <Button icon={<UploadOutlined />}>
                    选择文件
                </Button>}
            </Upload>

            {!isSubmitted && !disabled && fileList.length > 0 && (
                <div style={{ marginTop: 16 }}><Button type="primary" onClick={handleSubmit}> 确认答案 </Button></div>
            )}
        </div>
    );
};

export default FileInteraction;