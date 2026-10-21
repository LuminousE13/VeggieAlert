import { getKrogerToken, getNearbyStores, searchProducts } from "@/lib/kroger";
import { compareByUnitPrice } from "@/lib/units";

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

    try {
        const token = await getKrogerToken();
        const stores = await getNearbyStores(token, lat, lon);

        const perStore = await Promise.all(
            stores.map(async (store: any) => {
                const products = await searchProducts(token, term, store.id);
                return products.map((p: any) => ({ ...p, store }));
            })
        );

        const results = perStore.flat().sort(compareByUnitPrice);

        return Response.json({ stores, results });
    } catch (err: any) {
        console.log(err);
        return Response.json({ error: err.message }, { status: 500 });
    }
}