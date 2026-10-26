export type Product = {
    name: string;
    brand: string;
    size: string;
    price: number;
    onSale: boolean;
    unitPrice: number | null;
    unitLabel: string | null;
    store: Store;
    id: string;
    image: string | null;
}

export type Store = {
    name: string;
    address: string;
    id: string;
}