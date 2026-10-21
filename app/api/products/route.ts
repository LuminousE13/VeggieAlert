import { getKrogerToken, KROGER_BASE } from "@/lib/kroger";
import { getUnitPrice } from "@/lib/units";
//to lazy to rewrite to so we just gonna have copy of code same thing for stores\route.ts
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const term = searchParams.get("term");
    const locationId = searchParams.get("locationId");

    if (!term || !locationId) {
        return Response.json(
            { error: "term and locationId are required" },
            { status: 400 }
        );
    }

    const token = await getKrogerToken();
    const res = await fetch(
        `${KROGER_BASE}/v1/products?filter.term=${encodeURIComponent(term)}&filter.locationId=${locationId}&filter.limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();

//error check cause it said sum bs
    if (!res.ok || !data.data) {
        console.log("Kroger error:", data);
        return Response.json(
            { error: "Kroger request failed", details: data },
            { status: res.status }
        );
    }

    const products = data.data
        .map((product: any) => {
            const item = product.items?.[0];
            const regular = item?.price?.regular;
            const promo = item?.price?.promo;
            const price = promo > 0 ? promo : regular;
            const unit = price !== undefined ? getUnitPrice(price, item?.size) : null;

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
            };
        })
        .filter((p: any) => p.price !== undefined)
        .sort((a: any, b: any) => {
            if (a.unitPrice === null && b.unitPrice === null) return a.price - b.price;
            if (a.unitPrice === null) return 1;
            if (b.unitPrice === null) return -1;
            return a.unitPrice - b.unitPrice;
        });

    return Response.json(products);
}