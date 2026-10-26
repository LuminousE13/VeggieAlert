import { getUnitPrice } from "@/lib/units";
// all this js sets up the Kroger API and request. We will sadly be using like 6 request at a time, but w supa base we can decrease ts
export const KROGER_BASE = "https://api-ce.kroger.com";

export async function getKrogerToken() {
    const auth = Buffer.from(
        `${process.env.KROGER_CLIENT_ID}:${process.env.KROGER_CLIENT_SECRET}`
    ).toString("base64");
    const res = await fetch(`${KROGER_BASE}/v1/connect/oauth2/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials&scope=product.compact",
    });
    const data = await res.json();
    return data.access_token;
}

export async function getNearbyStores(
    token: string,  //this is just declaring what I want for each request on my side the og stuff is on route.ts under stores//
    lat: string,
    lon: string,
    radius = 10,
    limit = 5
) {
    const res = await fetch(
        `${KROGER_BASE}/v1/locations?filter.latLong.near=${lat},${lon}&filter.radiusInMiles=${radius}&filter.limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    if (!res.ok || !data.data) {
        throw new Error(`Store lookup failed: ${JSON.stringify(data)}`);
    }

    return data.data.map((store: any) => ({
        id: store.locationId,
        name: store.name,
        address: `${store.address.addressLine1}, ${store.address.city}`,
        lat: store.geolocation.latitude,
        lon: store.geolocation.longitude,
    }));
}
//this is for the products which now that I am commenting should've been up there//
export async function searchProducts(
    token: string,
    term: string,
    locationId: string
) {
    const res = await fetch(
        `${KROGER_BASE}/v1/products?filter.term=${encodeURIComponent(term)}&filter.locationId=${locationId}&filter.limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    //made this and the one above for errors cause it gave me some weird thingy that idk how to read yet lmao
    const data = await res.json();
    if (!res.ok || !data.data) {
        throw new Error(`Product search failed: ${JSON.stringify(data)}`);
    }

    return data.data
        .map((product: any) => {
            const item = product.items?.[0];
            const regular = item?.price?.regular;
            const promo = item?.price?.promo;
            const price = promo > 0 ? promo : regular;
            const unit = price !== undefined ? getUnitPrice(price, item?.size) : null;
            const images = product.images ?? [];
            const mainImage =
                images.find((img: any) => img.featured) ??
                images.find((img: any) => img.perspective === "front") ??
                images[0];
            const image =
                mainImage?.sizes?.find((s: any) => s.size === "medium")?.url ??
                mainImage?.sizes?.[0]?.url ??
                null; //why the heck is getting images so hard

            return {
                id: product.productId,
                upc: product.upc,
                name: product.description,
                brand: product.brand,
                size: item?.size,
                price,
                onSale: promo > 0,
                unitPrice: unit?.unitPrice ?? null,
                unitLabel: unit?.unitLabel ?? null,
                image,
            };
        })
        .filter((p: any) => p.price !== undefined);
}