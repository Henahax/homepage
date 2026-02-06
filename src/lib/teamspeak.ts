import pkg from "teamspeak3.js";
const { TeamSpeak } = pkg;

let ts3: any = null;

export async function getTS() {
    if (!ts3) {
        ts3 = new TeamSpeak({
            host: "henahax.de",
            queryport: 10011,
            serverport: 9987,
            username: "viewer",
            password: "secret",
            nickname: "henahax.de TeamSpeak Viewer"
        });

        await ts3.connect();
    }
    return ts3;
}