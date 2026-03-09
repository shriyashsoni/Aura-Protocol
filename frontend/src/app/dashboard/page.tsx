"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { commitmentsApi, marketplaceApi, payloadsApi } from "../../lib/api-client";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

export default function DashboardPage() {
  const { connected, publicKey, wallet } = useWallet();
  const router = useRouter();

  // State for all real-time, on-chain data
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [listings, setListings] = useState<any[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState("");

  // Wallet loading state: true until wallet adapter is initialized
  const [walletReady, setWalletReady] = useState(false);
  useEffect(() => {
    // Wait for wallet adapter to finish initializing
    // The wallet object is undefined until ready
    if (wallet !== undefined) {
      setWalletReady(true);
    }
  }, [wallet]);



  useEffect(() => {
    if (connected) {
      setProfileLoading(true);
      commitmentsApi.getProfile()
        .then((res) => {
          if (res.success) setProfile(res.data);
          else setProfileError(res.error || "Failed to fetch profile");
        })
        .catch((e) => setProfileError(e.message || "Unknown error"))
        .finally(() => setProfileLoading(false));

      setListingsLoading(true);
      marketplaceApi.getListings()
        .then((res) => {
          if (res.success) setListings(res.data || []);
          else setListingsError(res.error || "Failed to fetch listings");
        })
        .catch((e) => setListingsError(e.message || "Unknown error"))
        .finally(() => setListingsLoading(false));
      // TODO: Fetch payments, tickets, inference, etc. here
    }
  }, [connected]);


  if (!walletReady) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading wallet...</div>;
  }
  if (!connected) {
    // Show wallet connect prompt on dashboard
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">Connect your wallet to view the dashboard</h1>
        <div className="mb-8">Please connect your Aleo wallet to access your dashboard and on-chain data.</div>
        <div className="[&>.wallet-adapter-dropdown]:w-full [&>.wallet-adapter-button]:bg-white [&>.wallet-adapter-button]:text-black [&>.wallet-adapter-button]:font-medium [&>.wallet-adapter-button]:text-xs [&>.wallet-adapter-button]:rounded [&>.wallet-adapter-button]:h-10 [&>.wallet-adapter-button]:px-4 [&>.wallet-adapter-button]:py-2 [&>.wallet-adapter-button:hover]:bg-neutral-200 [&>.wallet-adapter-button]:transition-colors">
          <WalletMultiButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <div className="mb-6 text-lg">Wallet: <span className="font-mono text-green-400">{publicKey}</span></div>

      {/* Profile Section */}
      <div className="w-full max-w-xl bg-white/5 rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-2">Profile Commitments</h2>
        {profileLoading && <div className="text-neutral-400">Loading profile...</div>}
        {profileError && <div className="text-red-400">{profileError}</div>}
        {profile && (
          <pre className="text-xs bg-black/60 p-4 rounded overflow-x-auto border border-white/10">
            {JSON.stringify(profile, null, 2)}
          </pre>
        )}
        {!profileLoading && !profileError && !profile && (
          <div className="text-neutral-400">No profile found.</div>
        )}
      </div>

      {/* Marketplace Listings Section */}
      <div className="w-full max-w-2xl bg-white/5 rounded p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-2">Marketplace Listings</h2>
        {listingsLoading && <div className="text-neutral-400">Loading listings...</div>}
        {listingsError && <div className="text-red-400">{listingsError}</div>}
        {listings.length > 0 ? (
          <ul className="divide-y divide-white/10">
            {listings.map((listing) => (
              <li key={listing.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-mono text-sm text-green-300">{listing.title}</div>
                  <div className="text-xs text-neutral-400">{listing.description}</div>
                  <div className="text-xs text-neutral-500">Type: {listing.dataType} | Seller: {listing.seller}</div>
                </div>
                <div className="mt-2 md:mt-0 text-right">
                  <span className="text-lg font-bold">{listing.price} ALEO</span>
                  <div className="text-xs text-neutral-500">{listing.available ? "Available" : "Sold"}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !listingsLoading && !listingsError && <div className="text-neutral-400">No listings found.</div>
        )}
      </div>

      {/* TODO: Add payments, tickets, inference, and contract actions here, all real and on-chain */}
    </div>
  );
}
