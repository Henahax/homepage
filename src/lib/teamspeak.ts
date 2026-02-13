import { Query } from 'teamspeak3.js';

const query = new Query({
    host: 'henahax.de',
    port: 10011
});

// Prevent unhandled 'error' events from crashing the process
query.on('error', (err: any) => {
    console.error('TeamSpeak query error:', err);
});

export async function getTree() {
    try {
        // Connect/login on demand so callers always get the current state
        if (!(query as any).connected) {
            await query.connect();
            await query.login('query', '1PU29TYU'); // todo: move to env
            await query.virtualServers.use(1);
        }

        const channels = Array.from((await query.channels.fetch()).values());
        const clients = Array.from((await query.clients.fetch()).values());

        if (!channels.length) {
            return [];
        }

        const channelMap = new Map<number, any>();

        // Init channels
        channels.forEach(ch => {
            // Channel objects expose `id` and `parentId` (not `cid`)
            channelMap.set(ch.id, {
                id: ch.id,
                name: ch.name,
                order: ch.order,
                parentId: ch.parentId,
                subchannels: [],
                clients: []
            });
        });

        // Assign clients to channels - clients use `channelId` and `id`
        clients.forEach(client => {
            const chanId = client.channelId;
            if (chanId && channelMap.has(chanId) && client.type === 0) { // type 0 = regular client
                channelMap.get(chanId).clients.push({
                    id: client.id,
                    nickname: client.nickname
                });
            }
        });

        // Build hierarchy
        const tree: any[] = [];

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

        // Sort siblings by numeric `order` (missing/non-numeric orders go last)
        const toNum = (v: any) => {
            const n = Number(v);
            return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
        };

        const sortTree = (nodes: any[]) => {
            nodes.sort((a, b) => toNum(a.order) - toNum(b.order));
            nodes.forEach(n => sortTree(n.subchannels));
        };

        sortTree(tree);

        return tree;

    } catch (error) {
        console.error('Failed to fetch TeamSpeak query data:', error);
        return [];
    }
}
