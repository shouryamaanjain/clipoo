export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => null);
    const status = payload?.status as string | undefined;
    const url = payload?.url as string | undefined;

    if (status === "completed" && url) {
      console.log("[Creatomate] Render completed:", url);
    } else if (status === "failed") {
      console.error("[Creatomate] Render failed:", payload);
    } else {
      console.log("[Creatomate] Callback received:", payload);
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    return new Response("ok", { status: 200 });
  }
}
