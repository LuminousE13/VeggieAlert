import { getKrogerToken, getNearbyStores, searchProducts } from "@/lib/kroger";
import { compareByUnitPrice } from "@/lib/units";
import { makeCacheKey, getCachedSearch, saveSearch } from "@/lib/cache";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const term = searchParams.get("term");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!term || !lat || !lon) {
        return Response.json(
            { error: "term, lat and lon are required" },
            { status: 400 }
        );
    }

    const key = makeCacheKey(term, lat, lon);
    const cached = await getCachedSearch(key);
    if (cached) {
        console.log("Cache hit:", key);
        return Response.json(cached);
    }
    console.log("Cache miss:", key);

    try {
        const token = await getKrogerToken();
        const stores = await getNearbyStores(token, lat, lon);
        const failedStores: string[] = [];

        const perStore = await Promise.all(
            stores.map(async (store: any) => {
                try {
                    const products = await searchProducts(token, term, store.id);
                    return products.map((p: any) => ({ ...p, store }));
                } catch (err) {
                    console.log(`Skipping ${store.name}:`, err);
                    failedStores.push(store.name);
                    return [];
                }
            })
        );

        const results = perStore.flat().sort(compareByUnitPrice);
        const response = { stores, results, failedStores };

        if (failedStores.length === 0) {
            await saveSearch(key, response);
        }

        return Response.json(response);
    } catch (err: any) {
        console.log(err);
        return Response.json({ error: err.message }, { status: 500 });
    }
}