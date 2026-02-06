export function buildTree(channels: any[], clients: any[]) {
    const clientsByChannel: Record<string, any[]> = {};

    clients.forEach(c => {
        const cid = String(c.cid);
        if (!clientsByChannel[cid]) clientsByChannel[cid] = [];
        clientsByChannel[cid].push({
            id: c.clid,
            nickname: c.nickname
        });
    });

    const channelMap: Record<string, any> = {};

    channels.forEach(ch => {
        const cid = String(ch.cid);
        const pid = String(ch.pid);

        channelMap[cid] = {
            id: cid,
            parent: pid,
            name: ch.name,
            children: [],
            clients: clientsByChannel[cid] || []
        };
    });

    // attach children
    Object.values(channelMap).forEach(ch => {
        if (ch.parent !== "0") {
            channelMap[ch.parent]?.children.push(ch);
        }
    });

    // collect roots
    const roots = Object.values(channelMap).filter(ch => ch.parent === "0");
    return roots;
}
