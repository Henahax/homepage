import { Query } from 'teamspeak3.js';

const query = new Query({
    host: 'henahax.de',
    port: 10011
});

await query.connect();
await query.login('query', '1PU29TYU'); // test password, todo: move to env
await query.virtualServers.use(1);

let channels = Array.from((await query.channels.fetch()).values());
let clients = Array.from((await query.clients.fetch()).values());

console.log("Raw channel data:", channels);
console.log("First channel keys:", channels.length > 0 ? Object.keys(channels[0]) : "no channels");

export async function getTree() {
    return await buildChannelTree(channels, clients);
}

function buildChannelTree(channels: any[], clients: any[]) {
    console.log("Building channel tree...");
    console.log("Channels:", channels);
    console.log("Clients:", clients);

    const channelMap = new Map<number, any>();

    // Init channels
    channels.forEach(ch => {
        channelMap.set(ch.cid, {
            id: ch.cid,
            name: ch.name,
            order: ch.order,
            parentId: ch.parentId,
            subchannels: [],
            clients: []
        });
    });

    // Assign clients to channels
    clients.forEach(client => {
        if (client.cid && channelMap.has(client.cid)) {
            channelMap.get(client.cid).clients.push({
                id: client.clid,
                nickname: client.nickname,
                talking: client.talking,
                away: client.away
            });
        }
    });

    // Build hierarchy
    const tree: any[] = [];

    console.log("ParentIds in channels:", Array.from(channelMap.values()).map(ch => ({ id: ch.id, parentId: ch.parentId })));

    channelMap.forEach(channel => {
        // Treat as root if: no parent, parent is 0, or parent doesn't exist in map
        if (channel.parentId === 0 || channel.parentId === null || channel.parentId === undefined) {
            tree.push(channel);
        } else {
            const parent = channelMap.get(channel.parentId);
            if (parent) {
                parent.subchannels.push(channel);
            } else {
                // Parent doesn't exist - treat as root
                tree.push(channel);
            }
        }
    });

    console.log("Tree after hierarchy build:", tree.length, "root channels");

    // Sort recursively
    const sortTree = (nodes: any[]) => {
        nodes.sort((a, b) => a.order - b.order);
        nodes.forEach(n => sortTree(n.subchannels));
    };

    sortTree(tree);


    console.log("Channel tree built:");
    console.log(tree);
    return tree;
}
