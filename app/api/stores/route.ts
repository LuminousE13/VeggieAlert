async function getKrogerToken() {
    const auth = Buffer.from(
        `${process.env.KROGER_CLIENT_ID}:${process.env.KROGER_CLIENT_SECRET}`
    ).toString("base64");
    const res = await fetch("https://api-ce.kroger.com/v1/connect/oauth2/token", {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials&scope=product.compact",
    });
    return (await res.json()).access_token;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const token = await getKrogerToken();
    const res = await fetch(
        `https://api-ce.kroger.com/v1/locations?filter.latLong.near=${lat},${lon}&filter.radiusInMiles=10`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return Response.json(await res.json());
}