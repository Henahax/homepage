declare const process: {
    env: Record<string, string | undefined>;
};

type TeamspeakChannel = {
    cid?: string | number;
    id?: string | number;
    channel_name?: string;
    cname?: string;
    name?: string;
    pid?: string | number;
    cpid?: string | number;
    parentId?: string | number;
    channel_order?: string | number;
    order?: string | number;
};

type TeamspeakClient = {
    cid?: string | number;
    channelId?: string | number;
    clid?: string | number;
    id?: string | number;
    client_type?: number;
    type?: number;
    client_nickname?: string;
    nickname?: string;
};

const TEAMSPEAK_BASE_URL = process.env.TEAMSPEAK_BASE_URL || 'http://localhost';
const TEAMSPEAK_QUERY_PORT = process.env.TEAMSPEAK_QUERY_PORT || '10080';
const TEAMSPEAK_API_KEY = process.env.TEAMSPEAK_API_KEY || '';
const TEAMSPEAK_SERVER_ID = process.env.TEAMSPEAK_SERVER_ID || '1';
const CACHE_TTL = Number(process.env.TEAMSPEAK_CACHE_TTL_MS ?? process.env.TEAMSPEAK_CACHE_TTL ?? '60000');

let cachedTree: { tree: any; ts: number } | null = null;
let inflightFetch: Promise<any> | null = null;

async function fetchTeamspeakData(endpoint: 'channellist' | 'clientlist') {
    const response = await fetch(
        `${TEAMSPEAK_BASE_URL}:${TEAMSPEAK_QUERY_PORT}/${TEAMSPEAK_SERVER_ID}/${endpoint}?api-key=${encodeURIComponent(
            TEAMSPEAK_API_KEY
        )}`,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data.body) ? data.body : [];
}

async function fetchChannels() {
    return fetchTeamspeakData('channellist');
}

async function fetchClients() {
    return fetchTeamspeakData('clientlist');
}

async function fetchTreeFromServer() {
    const channels = await fetchChannels();
    const clients = await fetchClients();

    const channelMap = new Map<number, any>();

    channels.forEach((ch: TeamspeakChannel) => {
        const rawChannelId = ch.cid ?? ch.id;
        if (rawChannelId == null) return;

        const channelId = Number(rawChannelId);
        if (Number.isNaN(channelId)) return;

        const rawParent = ch.pid ?? ch.cpid ?? ch.parentId;
        const parentId = rawParent == null || rawParent === '0' ? 0 : Number(rawParent);

        channelMap.set(channelId, {
            id: channelId,
            name: ch.channel_name || ch.cname || ch.name || '',
            order: Number(ch.channel_order ?? ch.order ?? 0),
            parentId,
            subchannels: [],
            clients: []
        });
    });

    clients.forEach((client: TeamspeakClient) => {
        const rawChanId = client.cid ?? client.channelId;
        if (rawChanId == null) return;

        const chanIdNum = Number(rawChanId);
        if (Number.isNaN(chanIdNum) || !channelMap.has(chanIdNum)) return;

        const clientId = client.clid ?? client.id;
        channelMap.get(chanIdNum).clients.push({
            id: clientId == null ? null : Number(clientId) || clientId,
            nickname: client.client_nickname || client.nickname || '',
            type: client.client_type ?? client.type ?? 0
        });
    });

    const byParent = new Map<number, any[]>();
    channelMap.forEach((channel) => {
        const parentId = channel.parentId ?? 0;
        if (!byParent.has(parentId)) {
            byParent.set(parentId, []);
        }
        byParent.get(parentId)!.push(channel);
    });

    const sortGroup = (group: any[]) => {
        const sorted: any[] = [];
        const remaining = new Set(group.map((item) => item.id));

        let current = group.find((channel) => Number(channel.order) === 0);
        if (!current) {
            return group.slice().sort((a, b) => Number(a.order) - Number(b.order));
        }

        while (current) {
            sorted.push(current);
            remaining.delete(current.id);
            current = group.find((channel) => Number(channel.order) === current.id);
        }

        if (remaining.size) {
            const leftovers = group.filter((channel) => remaining.has(channel.id));
            leftovers.sort((a, b) => Number(a.order) - Number(b.order));
            sorted.push(...leftovers);
        }

        return sorted;
    };

    const buildTree = (parentId = 0): any[] => {
        const group = byParent.get(parentId);
        if (!group) return [];
        const sorted = sortGroup(group);
        return sorted.map((channel) => ({
            ...channel,
            subchannels: buildTree(channel.id)
        }));
    };

    return buildTree(0);
}

export async function getTree() {
    if (cachedTree && Date.now() - cachedTree.ts < CACHE_TTL) {
        return cachedTree.tree;
    }

    if (inflightFetch) {
        try {
            return await inflightFetch;
        } catch (error) {
            if (cachedTree) return cachedTree.tree;
            console.error('Failed inflight fetch:', error);
            return [];
        }
    }

    inflightFetch = (async () => {
        try {
            const tree = await fetchTreeFromServer();
            cachedTree = { tree, ts: Date.now() };
            return tree;
        } finally {
            inflightFetch = null;
        }
    })();

    try {
        return await inflightFetch;
    } catch (error) {
        console.error('Failed to fetch TeamSpeak data:', error);
        if (cachedTree) return cachedTree.tree;
        return [];
    }
}
