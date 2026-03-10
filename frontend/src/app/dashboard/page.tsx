// --- Ticket Issue Form Component ---
function TicketIssueForm({ publicKey }: { publicKey: string | null }) {
  const notify = useNotify();
  const [form, setForm] = useState({
    providerAddress: publicKey || "",
    listingId: "",
    paymentIntentId: "",
    queryCommitment: "",
    paidMicrocredits: "",
    expiresAtEpoch: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // TODO: Replace with real API call
      // await someApi.issueTicket(form);
      setSuccess("Ticket issued!");
      notify({ type: "success", message: "Ticket issued!" });
    } catch (e: any) {
      setError(e?.message || "Failed to issue ticket");
      notify({ type: "error", message: e?.message || "Failed to issue ticket" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input name="providerAddress" value={form.providerAddress} onChange={handleChange} required placeholder="Provider Address" className="bg-neutral-800 rounded px-3 py-2 text-white" />
      <input name="listingId" value={form.listingId} onChange={handleChange} required placeholder="Listing ID" className="bg-neutral-800 rounded px-3 py-2 text-white" />
      <input name="paymentIntentId" value={form.paymentIntentId} onChange={handleChange} required placeholder="Payment Intent ID" className="bg-neutral-800 rounded px-3 py-2 text-white" />
      <input name="queryCommitment" value={form.queryCommitment} onChange={handleChange} required placeholder="Query Commitment" className="bg-neutral-800 rounded px-3 py-2 text-white" />
      <input name="paidMicrocredits" value={form.paidMicrocredits} onChange={handleChange} required placeholder="Paid Microcredits (e.g. 1000000u64)" className="bg-neutral-800 rounded px-3 py-2 text-white" />
      <input name="expiresAtEpoch" value={form.expiresAtEpoch} onChange={handleChange} required placeholder="Expires At Epoch (e.g. 123456u32)" className="bg-neutral-800 rounded px-3 py-2 text-white" />
      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold mt-2 disabled:opacity-60" disabled={loading}>
        {loading ? "Issuing..." : "Issue Ticket"}
      </button>
      {error && <div className="text-red-400 mt-2">{error}</div>}
      {success && <div className="text-green-400 mt-2">{success}</div>}
    </form>
  );
}
// --- Payment Intent Form Component ---
function PaymentIntentForm({ publicKey }: { publicKey: string | null }) {
  const notify = useNotify();
  const [form, setForm] = useState({
    providerAddress: publicKey || "",
    listingId: "",
    intentId: "",
    amountMicrocredits: "",
    paymentCommitment: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await payloadsApi.createPaymentPayload(form);
      if (res.error) {
        setError(res.error);
        notify({ type: "error", message: res.error });
      } else {
        setSuccess("Payment intent created! Payload: " + JSON.stringify(res));
        notify({ type: "success", message: "Payment intent created!" });
      }
    } catch (e: any) {
      setError(e?.message || "Failed to create payment intent");
      notify({ type: "error", message: e?.message || "Failed to create payment intent" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input name="providerAddress" value={form.providerAddress} onChange={handleChange} required placeholder="Provider Address" className="bg-neutral-800 rounded px-3 py-2 text-white" />
      <input name="listingId" value={form.listingId} onChange={handleChange} required placeholder="Listing ID" className="bg-neutral-800 rounded px-3 py-2 text-white" />
      <input name="intentId" value={form.intentId} onChange={handleChange} required placeholder="Intent ID" className="bg-neutral-800 rounded px-3 py-2 text-white" />
      <input name="amountMicrocredits" value={form.amountMicrocredits} onChange={handleChange} required placeholder="Amount (microcredits, e.g. 1000000u64)" className="bg-neutral-800 rounded px-3 py-2 text-white" />
      <input name="paymentCommitment" value={form.paymentCommitment} onChange={handleChange} required placeholder="Payment Commitment" className="bg-neutral-800 rounded px-3 py-2 text-white" />
      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold mt-2 disabled:opacity-60" disabled={loading}>
        {loading ? "Creating..." : "Create Payment Intent"}
      </button>
      {error && <div className="text-red-400 mt-2">{error}</div>}
      {success && <div className="text-green-400 mt-2">{success}</div>}
    </form>
  );
}
// --- Inference Settlement Form Component ---
function InferenceSettlementForm({ publicKey }: { publicKey: string | null }) {
  const notify = useNotify();
  const [form, setForm] = useState({
    ownerAddress: publicKey || "",
    listingId: "",
    ticketId: "",
    queryCommitment: "",
    outputCommitment: "",
    settledEpoch: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await payloadsApi.settleInference(form);
      if (res.error) {
        setError(res.error);
        notify({ type: "error", message: res.error });
      } else {
        setSuccess("Inference settled! Payload: " + JSON.stringify(res));
        notify({ type: "success", message: "Inference settled!" });
      }
    } catch (e: any) {
      setError(e?.message || "Failed to settle inference");
      notify({ type: "error", message: e?.message || "Failed to settle inference" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input name="ownerAddress" value={form.ownerAddress} onChange={handleChange} required placeholder="Owner Address" className="bg-neutral-800 rounded px-3 py-2 text-white" />
      <input name="listingId" value={form.listingId} onChange={handleChange} required placeholder="Listing ID" className="bg-neutral-800 rounded px-3 py-2 text-white" />
      <input name="ticketId" value={form.ticketId} onChange={handleChange} required placeholder="Ticket ID" className="bg-neutral-800 rounded px-3 py-2 text-white" />
      <input name="queryCommitment" value={form.queryCommitment} onChange={handleChange} required placeholder="Query Commitment" className="bg-neutral-800 rounded px-3 py-2 text-white" />
      <input name="outputCommitment" value={form.outputCommitment} onChange={handleChange} required placeholder="Output Commitment" className="bg-neutral-800 rounded px-3 py-2 text-white" />
      <input name="settledEpoch" value={form.settledEpoch} onChange={handleChange} required placeholder="Settled Epoch (e.g. 123456u32)" className="bg-neutral-800 rounded px-3 py-2 text-white" />
      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold mt-2 disabled:opacity-60" disabled={loading}>
        {loading ? "Settling..." : "Settle Inference"}
      </button>
      {error && <div className="text-red-400 mt-2">{error}</div>}
      {success && <div className="text-green-400 mt-2">{success}</div>}
    </form>
  );
}
"use client";

import { useState, useEffect } from "react";
// ...existing code...
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { commitmentsApi, marketplaceApi, payloadsApi } from "../../lib/api-client";
import { useRef } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";
// --- Notification Context and Component ---
import React, { createContext, useContext } from "react";

type Notification = { type: "success" | "error" | "info"; message: string };
const NotificationContext = createContext<{
  notify: (n: Notification) => void;
} | null>(null);

function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);
  const notify = (n: Notification) => {
    setNotification(n);
    setTimeout(() => setNotification(null), 4000);
  };
  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all
          ${notification.type === "success" ? "bg-green-600" : notification.type === "error" ? "bg-red-600" : "bg-blue-600"}`}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
}

function useNotify() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotify must be used within NotificationProvider");
  return ctx.notify;
}

function DashboardPage() {
  const { connected, publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState("profile");


  // Profile state
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  // ...existing code...
  // Marketplace state
  const [listings, setListings] = useState<any[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState("");
  // Create listing modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  // Buy listing state
  const [buyLoadingId, setBuyLoadingId] = useState<string | null>(null);
  const [buyError, setBuyError] = useState("");

  const fetchListings = () => {
    setListingsLoading(true);
    setListingsError("");
    marketplaceApi.getListings()
      .then((res) => {
        if (res.success) setListings(res.data || []);
        else setListingsError(res.error || "Failed to fetch listings");
      })
      .catch((e) => setListingsError(e.message || "Unknown error"))
      .finally(() => setListingsLoading(false));
  };

  useEffect(() => {
    if (connected) {
      setProfileLoading(true);
      setProfileError("");
      commitmentsApi.getProfile()
        .then((res) => {
          if (res.success) setProfile(res.data);
          else setProfileError(res.error || "Failed to fetch profile");
        })
        .catch((e) => setProfileError(e.message || "Unknown error"))
        .finally(() => setProfileLoading(false));

      fetchListings();
    }
  }, [connected]);

  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">Connect your wallet to view the dashboard</h1>
        <div className="mb-8">Please connect your Aleo wallet to access your dashboard and on-chain data.</div>
        <div className="[&>.wallet-adapter-dropdown]:w-full [&>.wallet-adapter-button]:bg-white [&>.wallet-adapter-button]:text-black [&>.wallet-adapter-button]:font-medium [&>.wallet-adapter-button]:text-xs [&>.wallet-adapter-button]:rounded [&>.wallet-adapter-button]:h-10 [&>.wallet-adapter-button]:px-4 [&>.wallet-adapter-button]:py-2 [&>.wallet-adapter-button:hover]:bg-neutral-200 [&>.wallet-adapter-button]:transition-colors">
          <WalletMultiButton />
        </div>
        <StatusBar connected={false} publicKey={publicKey} />
        <StatusBar connected={connected} publicKey={publicKey} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-black text-white font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white/5 border-r border-white/10 flex flex-col py-8 px-4 min-h-screen">
        <div className="mb-10 text-2xl font-bold tracking-widest uppercase text-center">Dashboard</div>
        <nav className="flex flex-col gap-2">
          <button className={`text-left px-4 py-2 rounded transition-colors ${activeTab === "profile" ? "bg-white/10 text-green-400" : "hover:bg-white/10"}`} onClick={() => setActiveTab("profile")}>Profile</button>
          <button className={`text-left px-4 py-2 rounded transition-colors ${activeTab === "marketplace" ? "bg-white/10 text-green-400" : "hover:bg-white/10"}`} onClick={() => setActiveTab("marketplace")}>Marketplace</button>
          <button className={`text-left px-4 py-2 rounded transition-colors ${activeTab === "tickets" ? "bg-white/10 text-green-400" : "hover:bg-white/10"}`} onClick={() => setActiveTab("tickets")}>Tickets</button>
          <button className={`text-left px-4 py-2 rounded transition-colors ${activeTab === "payments" ? "bg-white/10 text-green-400" : "hover:bg-white/10"}`} onClick={() => setActiveTab("payments")}>Payments</button>
          <button className={`text-left px-4 py-2 rounded transition-colors ${activeTab === "inference" ? "bg-white/10 text-green-400" : "hover:bg-white/10"}`} onClick={() => setActiveTab("inference")}>Inference</button>
        </nav>
        <div className="mt-auto pt-10 border-t border-white/10">
          <div className="text-xs text-neutral-400 mb-2">Wallet</div>
          <div className="font-mono text-green-400 break-all text-xs">{publicKey}</div>
          <div className="mt-4">
            <WalletMultiButton />
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === "profile" && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Profile</h2>
            <div className="bg-white/5 rounded p-6 mb-8">
              {profileLoading && <div className="text-neutral-400">Loading profile...</div>}
              {profileError && <div className="text-red-400">{profileError}</div>}
              {profile && (
                <div className="space-y-2">
                  <div><span className="font-semibold">Profile ID:</span> <span className="font-mono text-green-300">{profile.profileId}</span></div>
                  <div><span className="font-semibold">Age Bucket Commitment:</span> <span className="font-mono">{profile.ageBucketCommitment}</span></div>
                  <div><span className="font-semibold">Region Commitment:</span> <span className="font-mono">{profile.regionCommitment}</span></div>
                  <div><span className="font-semibold">Behavior Commitment:</span> <span className="font-mono">{profile.behaviorCommitment}</span></div>
                  <div><span className="font-semibold">KYC Commitment:</span> <span className="font-mono">{profile.kycCommitment}</span></div>
                  <div><span className="font-semibold">Nonce:</span> <span className="font-mono">{profile.nonce}</span></div>
                  <div><span className="font-semibold">Profile Root Commitment:</span> <span className="font-mono text-blue-300">{profile.profileRootCommitment}</span></div>
                </div>
              )}
              {!profileLoading && !profileError && !profile && (
                <div className="text-neutral-400">No profile found.</div>
              )}
            </div>
          </section>
        )}
        {activeTab === "marketplace" && (
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center justify-between">
              <span>Marketplace</span>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm font-semibold"
                onClick={() => {
                  setShowCreateModal(true);
                  setCreateError("");
                  setCreateSuccess("");
                }}
              >
                + Create Listing
              </button>
            </h2>
            <div className="bg-white/5 rounded p-6 mb-8">
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
                        <div className="text-xs text-neutral-500">Created: {new Date(listing.createdAt).toLocaleString()}</div>
                        <div className="text-xs text-neutral-500">Expires: {new Date(listing.expiresAt).toLocaleString()}</div>
                      </div>
                      <div className="mt-2 md:mt-0 text-right flex flex-col items-end gap-1">
                        <span className="text-lg font-bold">{listing.price} ALEO</span>
                        <div className="text-xs text-neutral-500 mb-1">{listing.available ? "Available" : "Sold"}</div>
                        {listing.available && (
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold disabled:opacity-60"
                            disabled={buyLoadingId === listing.id}
                            onClick={async () => {
                              setBuyLoadingId(listing.id);
                              setBuyError("");
                              try {
                                // Placeholder: replace with real buy logic
                                await new Promise((res) => setTimeout(res, 1200));
                                // Optionally call marketplaceApi.buyListing(listing.id)
                                fetchListings();
                              } catch (e: any) {
                                setBuyError(e?.message || "Failed to buy listing");
                              } finally {
                                setBuyLoadingId(null);
                              }
                            }}
                          >
                            {buyLoadingId === listing.id ? "Processing..." : "Buy"}
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                !listingsLoading && !listingsError && <div className="text-neutral-400">No listings found.</div>
              )}
              {buyError && <div className="text-red-400 mt-2">{buyError}</div>}
            </div>

            {/* Create Listing Modal */}
            {showCreateModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-neutral-900 rounded-lg shadow-lg p-8 w-full max-w-md relative">
                  <button
                    className="absolute top-3 right-3 text-neutral-400 hover:text-white text-xl"
                    onClick={() => setShowCreateModal(false)}
                  >×</button>
                  <h3 className="text-2xl font-bold mb-4">Create Listing</h3>
                  <form
                    className="flex flex-col gap-3"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setCreateLoading(true);
                      setCreateError("");
                      setCreateSuccess("");
                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);
                      const title = formData.get("title") as string;
                      const description = formData.get("description") as string;
                      const price = formData.get("price") as string;
                      const dataType = formData.get("dataType") as string;
                      try {
                        const res = await marketplaceApi.createListing({
                          title,
                          description,
                          price,
                          dataType,
                          seller: publicKey || "",
                        });
                        if (res.success) {
                          setCreateSuccess("Listing created!");
                          fetchListings();
                          setTimeout(() => setShowCreateModal(false), 1200);
                        } else {
                          setCreateError(res.error || "Failed to create listing");
                        }
                      } catch (e: any) {
                        setCreateError(e?.message || "Failed to create listing");
                      } finally {
                        setCreateLoading(false);
                      }
                    }}
                  >
                    <input name="title" required placeholder="Title" className="bg-neutral-800 rounded px-3 py-2 text-white" />
                    <textarea name="description" required placeholder="Description" className="bg-neutral-800 rounded px-3 py-2 text-white" />
                    <input name="price" required type="number" min="0" step="0.01" placeholder="Price (ALEO)" className="bg-neutral-800 rounded px-3 py-2 text-white" />
                    <input name="dataType" required placeholder="Data Type" className="bg-neutral-800 rounded px-3 py-2 text-white" />
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold mt-2 disabled:opacity-60"
                      disabled={createLoading}
                    >
                      {createLoading ? "Creating..." : "Create Listing"}
                    </button>
                    {createError && <div className="text-red-400 mt-2">{createError}</div>}
                    {createSuccess && <div className="text-green-400 mt-2">{createSuccess}</div>}
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

// (Removed duplicate TicketIssueForm definition)

// ...existing code...

        {activeTab === "tickets" && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Tickets</h2>
            <div className="bg-white/5 rounded p-6 mb-8">
              <TicketIssueForm publicKey={publicKey} />
            </div>
          </section>
        )}

// (Removed duplicate TicketIssueForm definition)
        {activeTab === "payments" && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Payments</h2>
            <div className="bg-white/5 rounded p-6 mb-8">
              <PaymentIntentForm publicKey={publicKey} />
            </div>
          </section>
        )}
        {activeTab === "inference" && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Inference</h2>
            <div className="bg-white/5 rounded p-6 mb-8">
              <InferenceSettlementForm publicKey={publicKey} />
            </div>
          </section>
        )}
      </main>
  // --- Status Bar Component ---
function StatusBar({ connected, publicKey }: { connected: boolean, publicKey: string | null }) {
  // Placeholder for network/security info
  return (
    <div className="w-full bg-neutral-900 border-b border-white/10 px-6 py-2 flex items-center justify-between text-xs">
      <div>
        <span className={connected ? "text-green-400" : "text-red-400"}>{connected ? "Wallet Connected" : "Wallet Disconnected"}</span>
        {publicKey && <span className="ml-4 text-neutral-400">{publicKey.slice(0, 12)}...{publicKey.slice(-6)}</span>}
      </div>
      <div className="text-neutral-400">Network: Aleo Testnet | Security: <span className="text-green-400">Secure</span></div>
    </div>
  );
}

export default function DashboardWithProviders() {
  return (
    <NotificationProvider>
      <DashboardPage />
    </NotificationProvider>
  );
}
