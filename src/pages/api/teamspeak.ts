import type { APIRoute } from "astro";
import { getTS } from "../../lib/teamspeak";
import { buildTree } from "../../lib/tsTree";

export const GET: APIRoute = async () => {
    try {
        const ts = await getTS();
        const [channels, clients] = await Promise.all([
            ts.channelList(),
            ts.clientList({ clientType: 0 })
        ]);

        const tree = buildTree(channels, clients);

        return new Response(JSON.stringify(tree), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "TS unavailable" }), {
            status: 500
        });
    }
};