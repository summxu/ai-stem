import { Client, Databases, ID, Permission, Role, Teams } from 'node-appwrite';

enum DatabaseName {
    ai_stem = '67ef70bd0025644c3858'
}
enum CollectionName {
    leaning = '67f0d09400061c9c9fe0',
}

export default async ({ req, res, log, error }: any) => {
    const client = new Client()
        .setEndpoint('http://172.26.165.231/v1')
        .setProject('67ee2731001981539fcb')
        .setKey('standard_a72b8cbf44bfde68c60a758ea8ca765750a6e910c87914784244be1393935f39f3d1d941d94f5252595be09e39384333daadcb7a21179291f2a5a48d5dea48da802ccbac4ad4f1c3290a3de7d119988ae1d90de58189b22cddb9688cc301f6642d1762e8db457ca481b58b7b0c0078457823901d6b79e253a310b8a12370a74b');
        
    const databases = new Databases(client);
    const teams = new Teams(client);

    if (req.path === '/ping') {
        return res.text('Pong');
    }

    if (req.path === '/listMemberships') {
        const { teamId } = req.bodyJson;
        const team = await teams.listMemberships(teamId)
        return res.json({
            status: true,
            data: team
        });
    }

    if (req.path === '/create') {
        const { data, teamId } = req.bodyJson;

        const leaning = await databases.createDocument(
            DatabaseName.ai_stem,
            CollectionName.leaning,
            ID.unique(),
            data,
            [
                Permission.delete(Role.label("admin")),
                Permission.update(Role.label("admin")),
                Permission.read(Role.label("admin")),
                Permission.update(Role.label("students")),
                Permission.read(Role.label("students")),
                Permission.update(Role.label("teachers")),
                Permission.read(Role.label("teachers")),
                Permission.read(Role.team(teamId))
            ]
        );

        return res.json({
            status: true,
            data: leaning
        });
    }

}