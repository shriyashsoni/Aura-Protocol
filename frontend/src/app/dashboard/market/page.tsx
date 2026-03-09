'use client';

import { useEffect, useState } from 'react';
import { api, type MarketplaceListing } from '@/lib/api-client';

export default function DashboardMarketPage() {
	const [listings, setListings] = useState<MarketplaceListing[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchListings() {
			try {
				setLoading(true);
				const response = await api.marketplace.getListings({ available: true });
				if (response.success) {
					setListings(response.data ?? []);
				} else {
					setError(response.error || 'Failed to load listings');
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error');
			} finally {
				setLoading(false);
			}
		}

		fetchListings();
	}, []);

	return (
		<section className="space-y-4">
			<h2 className="text-2xl font-semibold">Data Market</h2>
			
			{loading && <p className="text-neutral-400">Loading listings...</p>}
			
			{error && (
				<div className="rounded-lg bg-red-500/10 p-4 text-red-500">
					Error: {error}
				</div>
			)}
			
			{!loading && listings.length === 0 && (
				<p className="text-neutral-400">No market listings available.</p>
			)}
			
			{!loading && listings.length > 0 && (
				<div className="grid gap-4">
					{listings.map((listing) => (
						<div
							key={listing.id}
							className="rounded-lg border border-neutral-700 bg-neutral-900/50 p-4 hover:bg-neutral-900 transition-colors"
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<h3 className="font-semibold text-lg">{listing.title}</h3>
									<p className="text-sm text-neutral-400 mt-1">{listing.description}</p>
									<div className="flex gap-2 mt-3 flex-wrap">
										<span className="inline-block px-2 py-1 bg-neutral-800 rounded text-xs text-neutral-300">
											{listing.dataType}
										</span>
										<span className="inline-block px-2 py-1 bg-neutral-800 rounded text-xs text-neutral-300">
											{listing.price}
										</span>
									</div>
									<p className="text-xs text-neutral-500 mt-2">
										Seller: {listing.seller.substring(0, 10)}...
									</p>
								</div>
								<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
									Purchase
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</section>
	);
}
