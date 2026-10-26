import { supabase } from "@/lib/db";

const CACHE_HOURS = 12;

export function makeCacheKey(term: string, lat: string, lon: string) {
    const cleanTerm = term.toLowerCase().trim();
    const roundedLat = Number(lat).toFixed(2);
    const roundedLon = Number(lon).toFixed(2);
    return `${cleanTerm}|${roundedLat}|${roundedLon}`;
}

export async function getCachedSearch(key: string) {
    const cutoff = new Date(
        Date.now() - CACHE_HOURS * 60 * 60 * 1000
    ).toISOString();

    const { data, error } = await supabase
        .from("search_cache")
        .select("data")
        .eq("key", key)
        .gte("created_at", cutoff)
        .maybeSingle();

    if (error) {
        console.log("Cache read error:", error);
        return null;
    }
    return data?.data ?? null;
}

export async function saveSearch(key: string, result: unknown) {
    const { error } = await supabase.from("search_cache").upsert({
        key,
        data: result,
        created_at: new Date().toISOString(),
    });

    if (error) console.log("Cache write error:", error);
}