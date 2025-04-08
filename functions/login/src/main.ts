import { Client, Query, Users } from 'node-appwrite';
import * as argon2 from 'argon2';

export default async ({ req, res, log, error }: any) => {
    const client = new Client()
        .setEndpoint('http://172.26.165.231/v1')
        .setProject('67ee2731001981539fcb')
        .setKey('standard_a72b8cbf44bfde68c60a758ea8ca765750a6e910c87914784244be1393935f39f3d1d941d94f5252595be09e39384333daadcb7a21179291f2a5a48d5dea48da802ccbac4ad4f1c3290a3de7d119988ae1d90de58189b22cddb9688cc301f6642d1762e8db457ca481b58b7b0c0078457823901d6b79e253a310b8a12370a74b');
    const users = new Users(client);

    if (req.path === '/ping') {
        return res.text('Pong');
    }

    try {
        const { email, password } = req.bodyJson;
        const userList = await users.list([Query.equal('email', email)]);
        if (!userList.total) {
            throw new Error('用户名或密码错误！');
        }
        const user = userList.users[0];
        const hash = await argon2.verify(user.password || '', password);
        if (!hash) {
            throw new Error('用户名或密码错误！');
        }
        const token = await users.createToken(user.$id);
        log(token);
        return res.json({
            status: true,
            data: { ...token, userId: user.$id },
        });
    } catch (e: any) {
        error(e.message);
        return res.json({
            status: false,
            message: e.message,
        });
    }
}