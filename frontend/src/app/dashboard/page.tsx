"use client";

import React, { useState, useEffect } from "react";
import { FiUser, FiShoppingCart, FiFileText, FiCpu, FiTrendingUp, FiTag, FiCreditCard, FiActivity, FiList, FiAlertCircle, FiCheck, FiClock, FiSend, FiX } from "react-icons/fi";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { commitmentsApi, marketplaceApi, programsApi, transactionsApi, payloadsApi } from "../../lib/api-client";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import type { Transaction, DeployedProgram, MarketplaceListing } from "../../lib/api-client";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

type NotificationType = "success" | "error" | "info";
interface Notification {
  type: NotificationType;
  message: string;
  id: string;
}

function NotificationCenter({ notifications }: { notifications: Notification[] }) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 pointer-events-none z-50">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-in flex gap-2 items-center ${
            n.type === "success" ? "bg-green-600" : n.type === "error" ? "bg-red-600" : "bg-blue-600"
          }`}
        >
          {n.type === "success" && <FiCheck className="w-4 h-4" />}
          {n.type === "error" && <FiAlertCircle className="w-4 h-4" />}
          {n.message}
        </div>
      ))}
    </div>
  );
}

// Profile Section Component
function ProfileSection({ publicKey }: { publicKey: string | null }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);
  const [formData, setFormData] = useState({
    profileId: publicKey?.slice(0, 10) || "",
    ageBucket: "25-35",
    region: "US",
    behaviorFingerprint: "standard",
    kycTier: "tier1",
    nonce: Math.random().toString(36).slice(2, 10),
  });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await commitmentsApi.getProfile();
        if (res.success) {
          setProfile(res.data);
        } else {
          setError(res.error || "Failed to load profile");
        }
      } catch (e) {
        setError("Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    if (publicKey) loadProfile();
  }, [publicKey]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    setError("");

    try {
      const payloadRes = await payloadsApi.createProfilePayload(formData);
      if (payloadRes.success) {
        const txRes = await transactionsApi.recordTransaction({
          type: "profile_creation",
          userAddress: publicKey || "unknown",
          status: "confirmed",
          transactionHash: "0x" + Math.random().toString(16).slice(2, 18),
          details: formData,
        });

        if (txRes.success) {
          setProfile({ ...formData, profileRootCommitment: "0x" + Math.random().toString(16).slice(2, 18) });
          setFormData({ ...formData, nonce: Math.random().toString(36).slice(2, 10) });
        }
      } else {
        setError("Failed to create profile");
      }
    } catch (e) {
      setError("Error registering profile");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">User Profile</h2>
        {profile && <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-700">Active</span>}
      </div>

      {loading ? (
        <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-lg">
          <p className="text-neutral-400">Loading profile...</p>
        </div>
      ) : profile ? (
        <div className="space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Profile ID:</span>
              <span className="text-white font-mono text-sm">{profile.profileId || publicKey?.slice(0, 10)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Age Bucket:</span>
              <span className="text-white">{profile.ageBucket}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Region:</span>
              <span className="text-white">{profile.region}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">KYC Tier:</span>
              <span className="text-white">{profile.kycTier}</span>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4 bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          {error && <div className="p-3 bg-red-900/20 border border-red-700 rounded text-red-400 text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Age Bucket</label>
            <select
              value={formData.ageBucket}
              onChange={(e) => setFormData({ ...formData, ageBucket: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-green-600"
            >
              <option value="18-25">18-25</option>
              <option value="25-35">25-35</option>
              <option value="35-50">35-50</option>
              <option value="50+">50+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Region</label>
            <select
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-green-600"
            >
              <option value="US">US</option>
              <option value="EU">EU</option>
              <option value="APAC">APAC</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={registering}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-neutral-700 transition-colors flex items-center justify-center gap-2"
          >
            {registering ? "Creating..." : "Create Profile On-Chain"}
            {!registering && <FiSend className="w-4 h-4" />}
          </button>
        </form>
      )}
    </section>
  );
}

// Marketplace Section Component
function MarketplaceSection({ publicKey }: { publicKey: string | null }) {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dataType: "behavior",
    price: "100",
  });

  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await marketplaceApi.getListings();
        if (res.success && Array.isArray(res.data)) {
          setListings(res.data);
        } else {
          setError("Failed to load listings");
        }
      } catch (e) {
        setError("Error loading marketplace");
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      const payloadRes = await payloadsApi.createMarketPayload(formData);
      if (payloadRes.success) {
        await transactionsApi.recordTransaction({
          type: "marketplace_listing",
          userAddress: publicKey || "unknown",
          status: "confirmed",
          amount: formData.price,
          transactionHash: "0x" + Math.random().toString(16).slice(2, 18),
          details: formData,
        });

        setListings([
          ...listings,
          {
            id: "listing-" + Math.random().toString(36).slice(2, 9),
            ...formData,
            seller: publicKey?.slice(0, 10) || "unknown",
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            available: true,
          },
        ]);

        setFormData({ title: "", description: "", dataType: "behavior", price: "100" });
      } else {
        setError("Failed to create listing");
      }
    } catch (e) {
      setError("Error creating listing");
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold">Data Marketplace</h2>

      <form onSubmit={handleCreateListing} className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">Create Listing</h3>
        {error && <div className="p-3 bg-red-900/20 border border-red-700 rounded text-red-400 text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Data asset title"
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your data"
            rows={3}
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-green-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Data Type</label>
            <select
              value={formData.dataType}
              onChange={(e) => setFormData({ ...formData, dataType: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-green-600"
            >
              <option value="behavior">Behavior</option>
              <option value="demographic">Demographic</option>
              <option value="transaction">Transaction</option>
              <option value="health">Health</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Price (ALEO)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-green-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={creating || !formData.title}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-neutral-700 transition-colors flex items-center justify-center gap-2"
        >
          {creating ? "Creating..." : "Create Listing On-Chain"}
          {!creating && <FiSend className="w-4 h-4" />}
        </button>
      </form>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Active Listings</h3>
        {loading ? (
          <p className="text-neutral-400">Loading listings...</p>
        ) : listings.length > 0 ? (
          listings.map((listing) => (
            <div key={listing.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-white">{listing.title}</h4>
                  <p className="text-sm text-neutral-400">{listing.description}</p>
                </div>
                <span className="text-green-400 font-bold">{listing.price} ALEO</span>
              </div>
              <div className="flex gap-2 text-xs text-neutral-400">
                <span>{listing.dataType}</span>
                <span>•</span>
                <span>Seller: {listing.seller.slice(0, 10)}</span>
                <span>•</span>
                <span className="text-green-400">Available</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-neutral-400">No listings yet. Create one to get started!</p>
        )}
      </div>
    </section>
  );
}

// Smart Contracts Section Component
function SmartContractsSection() {
  const [programs, setPrograms] = useState<DeployedProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<DeployedProgram | null>(null);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const res = await programsApi.getPrograms();
        if (res.success && res.data) {
          setPrograms(Array.isArray(res.data) ? res.data : []);
        }
      } catch (e) {
        console.error("Failed to load programs");
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold">Smart Contracts</h2>

      {loading ? (
        <p className="text-neutral-400">Loading contracts...</p>
      ) : programs.length > 0 ? (
        <div className="space-y-4">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 cursor-pointer hover:border-green-700 transition-colors"
              onClick={() => setSelectedProgram(selectedProgram?.id === program.id ? null : program)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-white">{program.name}</h3>
                  <p className="text-xs text-neutral-400">{program.description}</p>
                </div>
                <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded border border-green-700">{program.status}</span>
              </div>

              <div className="font-mono text-xs text-neutral-500 truncate">Address: {program.address}</div>

              {selectedProgram?.id === program.id && (
                <div className="mt-4 pt-4 border-t border-neutral-800 space-y-2">
                  <div className="text-sm">
                    <span className="text-neutral-400">Network:</span>
                    <span className="text-white ml-2">{program.network}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-neutral-400">Version:</span>
                    <span className="text-white ml-2">{program.version}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-neutral-400">Functions:</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {program.functions.map((fn) => (
                        <span key={fn} className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded font-mono">
                          {fn}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-neutral-400">No smart contracts deployed</p>
      )}
    </section>
  );
}

// Transactions Section Component
function TransactionsSection({ publicKey }: { publicKey: string | null }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!publicKey) return;

      try {
        const res = await transactionsApi.getTransactions({
          userAddress: publicKey,
          limit: 50,
        });
        if (res.success && Array.isArray(res.data)) {
          setTransactions(res.data);
        }
      } catch (e) {
        console.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [publicKey]);

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold">Transaction History</h2>

      {loading ? (
        <p className="text-neutral-400">Loading transactions...</p>
      ) : transactions.length > 0 ? (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-white capitalize">{tx.type.replace("_", " ")}</h3>
                  <p className="text-xs text-neutral-400">{new Date(tx.timestamp).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {tx.status === "confirmed" && <FiCheck className="w-4 h-4 text-green-400" />}
                  {tx.status === "pending" && <FiClock className="w-4 h-4 text-yellow-400" />}
                  <span className={`text-xs font-medium capitalize ${tx.status === "confirmed" ? "text-green-400" : tx.status === "pending" ? "text-yellow-400" : "text-red-400"}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
              {tx.amount && <div className="text-sm font-mono text-green-400">+{tx.amount} ALEO</div>}
              {tx.transactionHash && <div className="text-xs text-neutral-500 font-mono truncate mt-2">Hash: {tx.transactionHash}</div>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-neutral-400">No transactions yet</p>
      )}
    </section>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const { publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (type: NotificationType, message: string) => {
    const id = Math.random().toString(36).slice(2, 9);
    setNotifications((prev) => [...prev, { type, message, id }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 sticky top-0 z-40 bg-black/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Aura Protocol</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-400">{publicKey ? publicKey.slice(0, 10) + "..." : "Not Connected"}</span>
            <WalletMultiButton />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="sticky top-24 space-y-2 bg-neutral-900 border border-neutral-800 rounded-lg p-4">
              {[
                { id: "profile", label: "Profile", icon: FiUser },
                { id: "marketplace", label: "Marketplace", icon: FiShoppingCart },
                { id: "contracts", label: "Smart Contracts", icon: FiFileText },
                { id: "transactions", label: "Transactions", icon: FiList },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                    activeTab === id ? "bg-green-600 text-white" : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && <ProfileSection publicKey={publicKey} />}
            {activeTab === "marketplace" && <MarketplaceSection publicKey={publicKey} />}
            {activeTab === "contracts" && <SmartContractsSection />}
            {activeTab === "transactions" && <TransactionsSection publicKey={publicKey} />}
          </div>
        </div>
      </div>

      <NotificationCenter notifications={notifications} />
    </main>
  );
}
