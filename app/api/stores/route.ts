import { getKrogerToken, KROGER_BASE } from "@/lib/kroger";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const token = await getKrogerToken();

    const res = await fetch(
        `${KROGER_BASE}/v1/locations?filter.latLong.near=${lat},${lon}&filter.radiusInMiles=10&filter.limit=5`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();

    const stores = data.data.map((store: any) => ({
        id: store.locationId,
        name: store.name,
        address: `${store.address.addressLine1}, ${store.address.city}`,
        lat: store.geolocation.latitude,
        lon: store.geolocation.longitude,
    }));

    return Response.json(stores);
}