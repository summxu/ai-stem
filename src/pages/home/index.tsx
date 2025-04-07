import { useUser } from '../../hooks/user.tsx';
import { account } from '../../utils/appwrite.ts';
import { Fragment } from 'react';
import { message } from 'antd';

function Home() {
    const { userInfo, login } = useUser();
    console.log(userInfo);
    const register = async () => {
        await account.create('unique()', 'test@test1.com', '12345678').catch(err => message.error(err.message));
        console.log(userInfo);
    };
    const loginHandle = () => {
        login('test@test1.com', '12345678');
    };

    const teamAddMembers = async () => {
        // const res = await functions.createExecution(FunctionName.starterTemplate, '', false, '/ping');
        // const res = await locale.listLanguages();
        // console.log(res);
        // const promise = databases.createDocument<Group>(
        //     DatabaseName.ai_stem,
        //     CollectionName.group,
        //     ID.unique(),
        //     {
        //         name: 'test',
        //         school: 'test',
        //         grade: '一年级',
        //     }
        // ).catch(err => message.error(err.message))
        // databases.listDocuments(DatabaseName.ai_stem, CollectionName.leaning)
        // databases.createDocument<Learning>(
        //     DatabaseName.ai_stem,
        //     CollectionName.leaning,
        //     ID.unique(),
        //     {
        //         duration: 2000
        //     }
        // ).catch(err => message.error(err.message))
        //
        // const res = await avatars.getFlag(Flag.Honduras);
        // console.log(res)
    };

    return (
        <Fragment>
            <button onClick={register}>注册</button>
            <button onClick={loginHandle}>登录</button>
            <button onClick={teamAddMembers}>Team添加小组数据</button>
            <p>home</p>
        </Fragment>
    );
}

export default Home;