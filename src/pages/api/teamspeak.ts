import type { APIRoute } from "astro";
import { getTree } from "../../lib/teamspeak";

export const GET: APIRoute = async () => {
    try {
        const tree = await getTree();

        console.log("--- API ---");
        console.log(tree);

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