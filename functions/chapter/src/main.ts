import { Client, Databases, Permission, Role } from 'node-appwrite';

enum DatabaseName {
    ai_stem = '67ef70bd0025644c3858'
}
enum CollectionName {
    chapter = '67f0b8cb00277ce1d71b',
}

export default async ({ req, res, log, error }: any) => {
    const client = new Client()
        .setEndpoint('http://172.26.165.231/v1')
        .setProject('67ee2731001981539fcb')
        .setKey('standard_a72b8cbf44bfde68c60a758ea8ca765750a6e910c87914784244be1393935f39f3d1d941d94f5252595be09e39384333daadcb7a21179291f2a5a48d5dea48da802ccbac4ad4f1c3290a3de7d119988ae1d90de58189b22cddb9688cc301f6642d1762e8db457ca481b58b7b0c0078457823901d6b79e253a310b8a12370a74b');
    const databases = new Databases(client);

    if (req.path === '/ping') {
        return res.text('Pong');
    }

    if (req.path === '/updatePermission') {
        const { premission, chapterIds } = req.bodyJson;

        for (let i = 0; i < chapterIds.length; i++) {
            const chapterId = chapterIds[i];
            await databases.updateDocument(
                DatabaseName.ai_stem,
                CollectionName.chapter,
                chapterId,
                {},
                [
                    Permission.update(Role.label("admin")),
                    Permission.delete(Role.label("admin")),
                    Permission.read(Role.label("admin")),
                    ...premission.map((teamId: string) => Permission.read(Role.team(teamId)))
                ]
            );
        }

        return res.json({
            status: true,
            data: {}
        });
    }

}