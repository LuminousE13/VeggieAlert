import {Product} from '@/lib/types'


export default function ProductCard({ product }: { product: Product }) {
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const unitPriceFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',  //this is so when unit price is more than .00
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
    });
    const destination = `${product.store.name}, ${product.store.address}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;

    return (
        <a href={mapsUrl}
           target="_blank"
           rel="noopener noreferrer" //no open cant control tab and no refer is so it doenst know where user came from
           className="flex gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-200">

            {product.image ? (
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-28 w-28 shrink-0 rounded-xl object-contain"
                />
            ) : (
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">
                    No image
                </div>
            )}

            <div className="flex flex-1 flex-col gap-2">
                <div>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <p className="text-lg font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.size}</p>
                </div>

                <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">
                        {currencyFormatter.format(product.price)}
                    </p>
                    {product.onSale && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                            Sale
                        </span>
                    )}
                </div>

                {product.unitPrice !== null && (
                    <p className="text-sm text-gray-600">
                        {unitPriceFormatter.format(product.unitPrice)} {product.unitLabel}
                    </p>
                )}

                <div className="mt-1 border-t border-gray-200 pt-3">
                    <p className="text-sm font-medium text-gray-900">{product.store.name}</p>
                    <p className="text-sm text-gray-500">{product.store.address}</p>
                </div>
            </div>

        </a>
    );
}