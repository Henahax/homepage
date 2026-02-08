import { Query } from 'teamspeak3.js';

export async function getTS() {
    console.log("Getting TS data...");

    const { channels, clients } = await getData();
    return buildChannelTree(channels, clients);
}

function getData(): Promise<{ channels: any[]; clients: any[] }> {
    return new Promise((resolve, reject) => {
        // Create a fresh query instance for each request
        const query = new Query({
            host: 'henahax.de',
            port: 10011
        });

        // Listen to all events for debugging
        query.on('ready', async () => {
            console.log('EVENT: ready');
            try {
                console.log('Connected to TeamSpeak server');

                await query.virtualServers.use(1);

                const channels = Array.from(
                    (await query.channels.fetch()).values()
                );

                const clients = Array.from(
                    (await query.clients.fetch()).values()
                );

                resolve({ channels, clients });
            } catch (err) {
            }
        });
    });
}

function buildChannelTree(channels: any[], clients: any[]) {
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

    channelMap.forEach(channel => {
        if (channel.parentId === 0) {
            tree.push(channel);
        } else {
            const parent = channelMap.get(channel.parentId);
            if (parent) parent.subchannels.push(channel);
        }
    });

    // Sort recursively
    const sortTree = (nodes: any[]) => {
        nodes.sort((a, b) => a.order - b.order);
        nodes.forEach(n => sortTree(n.subchannels));
    };

    sortTree(tree);
    return tree;
}
