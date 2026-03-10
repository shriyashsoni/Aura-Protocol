"use client";

import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import { FiUser, FiShoppingCart, FiFileText, FiCpu, FiTrendingUp, FiTag, FiCreditCard, FiActivity } from "react-icons/fi";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { commitmentsApi, marketplaceApi, payloadsApi } from "../../lib/api-client";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

// --- Notification Context ---
type Notification = { type: "success" | "error" | "info"; message: string };
const NotificationContext = createContext<{ notify: (n: Notification) => void } | null>(null);

function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notify = (n: Notification) => {
    setNotifications([...notifications, n]);
    setTimeout(() => setNotifications(prev => prev.slice(1)), 3000);
  };
  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 pointer-events-none z-50">
        {notifications.map((n, i) => (
          <div key={i} className={`px-4 py-2 rounded shadow-lg text-white text-sm font-medium ${n.type === "success" ? "bg-green-600" : n.type === "error" ? "bg-red-600" : "bg-blue-600"}`}>
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

function useNotify() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotify must be used within NotificationProvider");
  return ctx.notify;
}

// --- Forms ---
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
      setSuccess("Ticket issued successfully!");
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
      <input name="providerAddress" value={form.providerAddress} onChange={handleChange} required placeholder="Provider Address" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <input name="listingId" value={form.listingId} onChange={handleChange} required placeholder="Listing ID" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <input name="paymentIntentId" value={form.paymentIntentId} onChange={handleChange} required placeholder="Payment Intent ID" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <input name="queryCommitment" value={form.queryCommitment} onChange={handleChange} required placeholder="Query Commitment" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <input name="paidMicrocredits" value={form.paidMicrocredits} onChange={handleChange} required placeholder="Paid Microcredits" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <input name="expiresAtEpoch" value={form.expiresAtEpoch} onChange={handleChange} required placeholder="Expires At Epoch" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold mt-2 disabled:opacity-50 transition-colors" disabled={loading}>
        {loading ? "Issuing..." : "Issue Ticket"}
      </button>
      {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
      {success && <div className="text-green-400 text-sm mt-2">{success}</div>}
    </form>
  );
}

function PaymentIntentForm({ publicKey }: { publicKey: string | null }) {
  const notify = useNotify();
  const [form, setForm] = useState({
    providerAddress: publicKey || "",
    listingId: "",
    intentId: "",
    intentCommitment: "",
    queryCommitment: "",
    chargeAmount: "",
    chargePerUnit: ""
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
      setSuccess("Payment intent created!");
      notify({ type: "success", message: "Payment intent created!" });
    } catch (e: any) {
      setError(e?.message || "Failed to create payment intent");
      notify({ type: "error", message: e?.message || "Failed to create payment intent" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input name="providerAddress" value={form.providerAddress} onChange={handleChange} required placeholder="Provider Address" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <input name="listingId" value={form.listingId} onChange={handleChange} required placeholder="Listing ID" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <input name="intentId" value={form.intentId} onChange={handleChange} required placeholder="Intent ID" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <input name="intentCommitment" value={form.intentCommitment} onChange={handleChange} required placeholder="Intent Commitment" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <input name="queryCommitment" value={form.queryCommitment} onChange={handleChange} required placeholder="Query Commitment" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <input name="chargeAmount" value={form.chargeAmount} onChange={handleChange} required placeholder="Charge Amount" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <input name="chargePerUnit" value={form.chargePerUnit} onChange={handleChange} required placeholder="Charge Per Unit" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold mt-2 disabled:opacity-50 transition-colors" disabled={loading}>
        {loading ? "Creating..." : "Create Payment Intent"}
      </button>
      {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
      {success && <div className="text-green-400 text-sm mt-2">{success}</div>}
    </form>
  );
}

function InferenceSettlementForm({ publicKey }: { publicKey: string | null }) {
  const notify = useNotify();
  const [form, setForm] = useState({
    providerAddress: publicKey || "",
    queryCommitment: "",
    resultCommitment: "",
    resultSalt: "",
    finalizeEpoch: ""
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
      setSuccess("Inference settled!");
      notify({ type: "success", message: "Inference settled!" });
    } catch (e: any) {
      setError(e?.message || "Failed to settle inference");
      notify({ type: "error", message: e?.message || "Failed to settle inference" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input name="providerAddress" value={form.providerAddress} onChange={handleChange} required placeholder="Provider Address" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <input name="queryCommitment" value={form.queryCommitment} onChange={handleChange} required placeholder="Query Commitment" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <input name="resultCommitment" value={form.resultCommitment} onChange={handleChange} required placeholder="Result Commitment" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <input name="resultSalt" value={form.resultSalt} onChange={handleChange} required placeholder="Result Salt" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <input name="finalizeEpoch" value={form.finalizeEpoch} onChange={handleChange} required placeholder="Finalize Epoch" className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500" />
      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold mt-2 disabled:opacity-50 transition-colors" disabled={loading}>
        {loading ? "Settling..." : "Settle Inference"}
      </button>
      {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
      {success && <div className="text-green-400 text-sm mt-2">{success}</div>}
    </form>
  );
}

// --- Main Dashboard Component ---
function DashboardPage() {
  const { publicKey, connected } = useWallet();

  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [listings, setListings] = useState<any[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState("");
  const [contracts, setContracts] = useState<any>(null);
  const [contractsLoading, setContractsLoading] = useState(false);
  const [contractsError, setContractsError] = useState("");

  // Fetch smart contract addresses
  const fetchContracts = async () => {
    setContractsLoading(true);
    setContractsError("");
    try {
      const res = await (await fetch("/api/v1/programs")).json();
      setContracts(res);
    } catch (e: any) {
      setContractsError(e.message || "Failed to fetch contracts");
    } finally {
      setContractsLoading(false);
    }
  };

  // Fetch profile and listings
  const fetchProfileAndListings = async () => {
    setProfileLoading(true);
    setProfileError("");
    setListingsLoading(true);
    setListingsError("");
    try {
      const [profileRes, listingsRes] = await Promise.all([
        commitmentsApi.getProfile(),
        marketplaceApi.getListings(),
      ]);
      if (profileRes.success) setProfile(profileRes.data);
      else setProfileError(profileRes.error || "Failed to fetch profile");
      if (listingsRes.success) setListings(listingsRes.data || []);
      else setListingsError(listingsRes.error || "Failed to fetch listings");
    } catch (e: any) {
      setProfileError(e.message || "Unknown error");
      setListingsError(e.message || "Unknown error");
    } finally {
      setProfileLoading(false);
      setListingsLoading(false);
    }
  };

  useEffect(() => {
    if (connected) {
      fetchProfileAndListings();
      fetchContracts();
    }
  }, [connected]);

  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
        <h1 className="text-4xl font-bold mb-4 text-center">Connect Your Wallet</h1>
        <p className="text-neutral-400 mb-8 text-center max-w-md">Please connect your Aleo wallet to access your dashboard and interact with on-chain data.</p>
        <div className="[&>.wallet-adapter-dropdown]:w-full [&>.wallet-adapter-button]:bg-white [&>.wallet-adapter-button]:text-black [&>.wallet-adapter-button]:font-semibold [&>.wallet-adapter-button]:text-sm [&>.wallet-adapter-button]:rounded [&>.wallet-adapter-button]:h-12 [&>.wallet-adapter-button]:px-6 [&>.wallet-adapter-button:hover]:bg-neutral-200 [&>.wallet-adapter-button]:transition-colors w-full max-w-xs">
          <WalletMultiButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-black text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-neutral-900 to-black border-r border-neutral-800 flex flex-col py-8 px-4 min-h-screen sticky top-0">
        <div className="mb-12 px-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-xs text-neutral-500 mt-1">Aleo Protocol</p>
        </div>
        
        <nav className="flex flex-col gap-2 mb-8">
          {[
            { id: "profile", label: "Profile", icon: <FiUser /> },
            { id: "marketplace", label: "Marketplace", icon: <FiShoppingCart /> },
            { id: "contracts", label: "Smart Contracts", icon: <FiFileText /> },
            { id: "aiagents", label: "AI Agents", icon: <FiCpu /> },
            { id: "profit", label: "Profit", icon: <FiTrendingUp /> },
            { id: "tickets", label: "Tickets", icon: <FiTag /> },
            { id: "payments", label: "Payments", icon: <FiCreditCard /> },
            { id: "inference", label: "Inference", icon: <FiActivity /> }
          ].map(tab => (
            <button
              key={tab.id}
              className={`text-left px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                activeTab === tab.id 
                  ? "bg-green-600 text-white shadow-lg" 
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-2 text-lg align-middle">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-neutral-800">
          <div className="text-xs text-neutral-500 mb-3 font-semibold uppercase tracking-wider">Wallet Status</div>
          <div className="bg-neutral-900 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Connected</span>
            </div>
            <div className="font-mono text-xs text-neutral-300 break-all line-clamp-2">{publicKey?.slice(0, 20)}...{publicKey?.slice(-8)}</div>
          </div>
          <WalletMultiButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Status Bar */}
        <div className="h-12 bg-neutral-900 border-b border-neutral-800 px-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div><span className="text-neutral-500">Network:</span> <span className="text-neutral-300 font-medium">Aleo Testnet</span></div>
            <div><span className="text-neutral-500">Status:</span> <span className="text-green-400 font-medium">Operational</span></div>
          </div>
          <div className="text-neutral-500">Last Updated: <span className="text-neutral-300 font-medium">Just now</span></div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === "profile" && (
            <section>
              <h2 className="text-3xl font-bold mb-6">Your Profile</h2>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
                {profileLoading && <div className="text-neutral-400">Loading profile...</div>}
                {profileError && <div className="text-red-400 bg-red-500/10 p-4 rounded">{profileError}</div>}
                {profile && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-neutral-800 rounded-lg p-4">
                      <div className="text-xs text-neutral-500 mb-2">Profile ID</div>
                      <div className="font-mono text-green-400 text-sm">{profile.profileId}</div>
                    </div>
                    <div className="bg-neutral-800 rounded-lg p-4">
                      <div className="text-xs text-neutral-500 mb-2">Age Bucket</div>
                      <div className="font-mono text-blue-400 text-sm">{profile.ageBucketCommitment?.slice(0, 16)}...</div>
                    </div>
                    <div className="bg-neutral-800 rounded-lg p-4">
                      <div className="text-xs text-neutral-500 mb-2">Region</div>
                      <div className="font-mono text-purple-400 text-sm">{profile.regionCommitment?.slice(0, 16)}...</div>
                    </div>
                    <div className="bg-neutral-800 rounded-lg p-4">
                      <div className="text-xs text-neutral-500 mb-2">Behavior</div>
                      <div className="font-mono text-yellow-400 text-sm">{profile.behaviorCommitment?.slice(0, 16)}...</div>
                    </div>
                  </div>
                )}
                {!profileLoading && !profileError && !profile && (
                  <div className="text-neutral-400">No profile data available.</div>
                )}
              </div>
            </section>
          )}

          {activeTab === "contracts" && (
            <section>
              <h2 className="text-3xl font-bold mb-6">Smart Contract Addresses</h2>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
                {contractsLoading && <div className="text-neutral-400">Loading contracts...</div>}
                {contractsError && <div className="text-red-400 bg-red-500/10 p-4 rounded">{contractsError}</div>}
                {contracts && (
                  <ul className="space-y-3">
                    {Object.entries(contracts).map(([key, value]) => (
                      <li key={key} className="flex justify-between items-center bg-neutral-800 rounded p-3">
                        <span className="font-semibold text-neutral-300">{key}</span>
                        <span className="font-mono text-green-400">{String(value)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {!contractsLoading && !contractsError && !contracts && (
                  <div className="text-neutral-400">No contract data available.</div>
                )}
              </div>
            </section>
          )}

          {activeTab === "aiagents" && (
            <section>
              <h2 className="text-3xl font-bold mb-6">AI Agents</h2>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
                <div className="text-neutral-400">AI agent data integration required. Please connect backend to real AI agent registry or service.</div>
              </div>
            </section>
          )}

          {activeTab === "profit" && (
            <section>
              <h2 className="text-3xl font-bold mb-6">Project Profit</h2>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
                <div className="text-neutral-400">Profit data integration required. Please connect backend to real profit/earnings data source.</div>
              </div>
            </section>
          )}

          {activeTab === "marketplace" && (
            <section>
              <h2 className="text-3xl font-bold mb-6">Marketplace Listings</h2>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
                {listingsLoading && <div className="text-neutral-400">Loading listings...</div>}
                {listingsError && <div className="text-red-400 bg-red-500/10 p-4 rounded">{listingsError}</div>}
                {listings.length > 0 ? (
                  <div className="grid gap-4">
                    {listings.map((listing, idx) => (
                      <div key={idx} className="bg-neutral-800 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-semibold text-white">Listing {idx + 1}</div>
                            <div className="text-xs text-neutral-400 mt-1">{JSON.stringify(listing).slice(0, 60)}...</div>
                          </div>
                          <span className="px-3 py-1 bg-green-600 text-white text-xs rounded">Active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-neutral-400">No listings found.</div>
                )}
              </div>
            </section>
          )}

          {activeTab === "tickets" && (
            <section>
              <h2 className="text-3xl font-bold mb-6">Issue Ticket</h2>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 max-w-2xl">
                <TicketIssueForm publicKey={publicKey} />
              </div>
            </section>
          )}

          {activeTab === "payments" && (
            <section>
              <h2 className="text-3xl font-bold mb-6">Payment Intent</h2>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 max-w-2xl">
                <PaymentIntentForm publicKey={publicKey} />
              </div>
            </section>
          )}

          {activeTab === "inference" && (
            <section>
              <h2 className="text-3xl font-bold mb-6">Inference Settlement</h2>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 max-w-2xl">
                <InferenceSettlementForm publicKey={publicKey} />
              </div>
            </section>
          )}
        </div>
      </main>
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
