type UnitType = "volume" | "weight" | "count";

const UNITS: Record<string, { type: UnitType; factor: number }> = {
    // volume → fl oz
    "fl oz": { type: "volume", factor: 1 },
    pt: { type: "volume", factor: 16 },
    qt: { type: "volume", factor: 32 },
    gal: { type: "volume", factor: 128 },
    ml: { type: "volume", factor: 0.033814 },
    l: { type: "volume", factor: 33.814 },

    // weight → oz
    oz: { type: "weight", factor: 1 },
    lb: { type: "weight", factor: 16 },
    lbs: { type: "weight", factor: 16 },
    g: { type: "weight", factor: 0.035274 },
    kg: { type: "weight", factor: 35.274 },

    // count → items
    ct: { type: "count", factor: 1 },
    ea: { type: "count", factor: 1 },
    each: { type: "count", factor: 1 },
};

const LABELS: Record<UnitType, string> = {
    volume: "fl oz",
    weight: "oz",
    count: "item",
};

export function parseSize(size: string) {
    const match = size
        .toLowerCase()
        .trim()
        .match(/^(\d+\/\d+|\d*\.?\d+)\s*(fl oz|[a-z]+)/);

    if (!match) return null;

    const amountText = match[1];
    const unitText = match[2];

    let amount: number;
    if (amountText.includes("/")) {
        const [top, bottom] = amountText.split("/").map(Number);
        amount = top / bottom;
    } else {
        amount = Number(amountText);
    }

    const unit = UNITS[unitText];
    if (!unit) return null;

    return { amount: amount * unit.factor, type: unit.type };
}

export function getUnitPrice(price: number, size?: string) {
    if (!size) return null;

    const parsed = parseSize(size);
    if (!parsed || parsed.amount === 0) return null;

    return {
        unitPrice: Math.round((price / parsed.amount) * 1000) / 1000,
        unitLabel: `per ${LABELS[parsed.type]}`,
    };
}

export function compareByUnitPrice(a: any, b: any) {
    if (a.unitPrice === null && b.unitPrice === null) return a.price - b.price;
    if (a.unitPrice === null) return 1;
    if (b.unitPrice === null) return -1;
    return a.unitPrice - b.unitPrice;
}