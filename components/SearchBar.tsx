'use client';
import {useState} from "react";

export default function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
    const [product, setProduct] = useState('');
    const handleSubmit = (event:any) => {
        event.preventDefault();
        onSearch(product);
    }
    return (
        <form onSubmit={handleSubmit} className="w-full max-w-xl">
            <div className="group flex items-center gap-3 rounded-full border border-gray-200 bg-white p-2 pl-5 shadow-lg shadow-green-900/5 transition hover:shadow-xl focus-within:border-green-500 focus-within:shadow-xl focus-within:ring-4 focus-within:ring-green-100">

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5 shrink-0 text-gray-400 transition group-focus-within:text-green-600"
                    aria-hidden="true"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path strokeLinecap="round" d="m20 20-3.5-3.5" />
                </svg>

                <input
                    value={product}
                    onChange={e => setProduct(e.target.value)}
                    placeholder="Search for milk, eggs, bananas..."
                    aria-label="Search for a product"
                    className="flex-1 bg-transparent py-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />

                <button
                    type="submit"
                    className="shrink-0 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-700 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-200"
                >
                    Search
                </button>

            </div>
        </form>
    );
}