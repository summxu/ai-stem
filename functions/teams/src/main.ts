import * as argon2 from 'argon2';
import { Client, ID, Models, Teams, Users } from 'node-appwrite';
import { generateRandomPassword, generateRandomString, numberToLetter, pinyinToInitials } from './utils.js';

export interface TeamGenerateResponse {
    teachers: Models.User<Models.Preferences>[],
    students: Models.User<Models.Preferences>[]
}

export default async ({ req, res, log, error }: any) => {
    const client = new Client()
        .setEndpoint('http://172.26.165.231/v1')
        .setProject('67ee2731001981539fcb')
        .setKey('standard_a72b8cbf44bfde68c60a758ea8ca765750a6e910c87914784244be1393935f39f3d1d941d94f5252595be09e39384333daadcb7a21179291f2a5a48d5dea48da802ccbac4ad4f1c3290a3de7d119988ae1d90de58189b22cddb9688cc301f6642d1762e8db457ca481b58b7b0c0078457823901d6b79e253a310b8a12370a74b');
    const users = new Users(client);
    const teams = new Teams(client);

    if (req.path === '/ping') {
        return res.text('Pong');
    }

    if (req.path === '/delete') {
        const { $id } = req.bodyJson;
        const data = await teams.delete($id);
        return res.json({
            status: true,
            data
        });
    }

    if (req.path === '/updateName') {
        const { $id, name } = req.bodyJson;
        const data = await teams.updateName($id, name)
        return res.json({
            status: true,
            data
        });
    }

    if (req.path === '/generate') {
        const { teamId, teacherCount, studentCount } = req.bodyJson;
        const teamInfo = await teams.get(teamId)
        const responseData: TeamGenerateResponse = {
            teachers: [],
            students: []
        }
        new Array(teacherCount).fill(0).forEach(async (_, index) => {
            const letter = numberToLetter(index)
            const user = await users.createArgon2User(
                ID.unique(),
                `${pinyinToInitials(teamInfo.name)}teacher${letter}@istem.com`,
                await argon2.hash(generateRandomPassword()),
                `${teamInfo.name}教师${letter}`
            );
            log(user)
            users.updateLabels(user.$id, ['teachers']);
            await teams.createMembership(teamId, ['teacher'], undefined, user.$id);
            responseData.teachers.push(user)
        })
        new Array(studentCount).fill(0).forEach(async () => {
            const number = generateRandomString()
            const user = await users.create(
                ID.unique(),
                `${pinyinToInitials(teamInfo.name)}student${number}@istem.com`,
                await argon2.hash(generateRandomPassword()),
                `${teamInfo.name}学生${number}`
            );
            users.updateLabels(user.$id, ['students']);
            await teams.createMembership(teamId, ['student'], undefined, user.$id);
            responseData.students.push(user)
        })
        return res.json({
            status: true,
            data: responseData
        });
    }
}