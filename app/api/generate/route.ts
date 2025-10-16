export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const topic = typeof body?.topic === "string" ? body.topic.trim() : "";
    if (!topic) {
      return new Response(JSON.stringify({ error: "Invalid body: topic is required" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nUrl) {
      return new Response(JSON.stringify({ error: "Server misconfigured: N8N_WEBHOOK_URL not set" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    const upstream = await fetch(n8nUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ topic }),
    });

    let data: unknown = { status: "accepted" };
    const ct = upstream.headers.get("content-type") || "";
    try {
      if (ct.includes("application/json")) {
        data = await upstream.json();
      } else {
        const text = await upstream.text();
        if (text) data = JSON.parse(text);
      }
    } catch {}

    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
