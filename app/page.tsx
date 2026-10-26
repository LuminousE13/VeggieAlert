'use client';
import {useEffect, useState} from 'react';
import SearchBar from '../components/SearchBar';
import ProductCard from "@/components/ProductCard";
import {Product} from '@/lib/types'
import Link from 'next/link';
import { addToHistory } from '@/lib/history';

type Location = { lat: number; lon: number };

export default function Search () {
    const [results, setResults] = useState<Product[]>([]);
    const [location, setLocation] = useState<Location | null>(null);
    const [message, setMessage] = useState('');
    const [searchKey, setSearchKey] = useState(0);

    useEffect(() => {
        if (!navigator.geolocation) {
            setMessage("Your browser doesn't support location.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) =>
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                }),
            () => setMessage('Allow location access')
        );
    }, []);

    async function handleSearch(term: string) {
        if (!location) {
            setMessage("Location not enabled");
            return;
        }
        setMessage('');

        const response = await fetch(`/api/search?term=${encodeURIComponent(term)}&lat=${location.lat}&lon=${location.lon}`)
        const data = await response.json()

        if (!response.ok) {
            setMessage(data.error ?? 'Search failed');
            return;
        }
        setResults(data.results)
        addToHistory(term);
    }
    function handleReset() {
        setResults([]);
        setMessage('');
        setSearchKey((k) => k + 1); //I didn't know I could do this w google
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">

            {/* Title bar */}
            <header className="sticky top-0 z-10 relative border-b border-gray-300 bg-white/80 backdrop-blur">
                <Link
                    href="/history"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-gray-500 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 transition hover:bg-gray-100"
                >
                    History
                </Link>

                <div className="mx-auto flex max-w-5xl items-center justify-center px-6 py-4">
                    <button
                        type="button"
                        onClick={handleReset}
                        aria-label="Veggie Alert, clear search"
                        className="rounded-lg transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-200"
                    >
                        <img src="/VeggieTracksTitle.svg" alt="" className="h-16 w-auto max-w-full" />
                    </button>
                </div>
            </header>

            {/* Subtitle */}
            <p className="pt-3 text-center text-sm tracking-wide text-gray-500">
                Find your food!!!
            </p>

            {/* Search and results */}
            <main
                className={`flex flex-1 flex-col items-center px-6 ${
                    results.length === 0 ? "justify-center pb-24" : "pt-8"
                }`}
            >
                <SearchBar key={searchKey} onSearch={handleSearch} />
                {message && <p className="mt-3 text-sm text-red-600">{message}</p>}

                {results.length > 0 && (
                    <div className="mt-8 flex w-full max-w-xl flex-col gap-6 pb-12">
                        {results.map((product) => (
                            <ProductCard
                                key={`${product.id}-${product.store.id}`}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </main>

        </div>
    );
}
