'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getHistory, clearHistory, HistoryEntry } from '@/lib/history';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    function handleClear() {
        clearHistory();
        setHistory([]);
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <header className="sticky top-0 z-10 border-b border-gray-300 bg-white/80 backdrop-blur">
                <Link
                    href="/"
                    aria-label="Back to search"
                    className="flex items-center justify-center px-6 py-4 transition hover:bg-gray-100/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-green-200"
                >
                    <img src="/VeggieTracksTitle.svg" alt="" className="h-16 w-auto max-w-full" />
                </Link>
            </header>

            <main className="mx-auto max-w-xl px-6 py-8">
                <h1 className="mb-6 text-center text-xl font-bold text-gray-900">Search history</h1>
                {history.length === 0 ? (
                    <p className="text-center text-gray-500">No searches yet.</p>
                ) : (
                    <>
                        <ul className="flex flex-col gap-3">
                            {history.map((entry) => (
                                <li
                                    key={entry.term}
                                    className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
                                >
                                    <span className="font-medium text-gray-900">{entry.term}</span>
                                    <span className="text-sm text-gray-500">
                                        {dateFormatter.format(new Date(entry.searchedAt))}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={handleClear}
                            className="mt-6 w-full rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                            Clear history
                        </button>
                    </>
                )}
            </main>

        </div>
    );
}