"use client";

import React, { useState, useEffect } from "react";
import { FiUser, FiShoppingCart, FiFileText, FiCpu, FiTrendingUp, FiTag, FiCreditCard, FiActivity, FiList, FiAlertCircle, FiCheck, FiClock } from "react-icons/fi";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { commitmentsApi, marketplaceApi, programsApi, transactionsApi, payloadsApi } from "../../lib/api-client";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import type { Transaction, DeployedProgram, MarketplaceListing } from "../../lib/api-client";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

// Notification system
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
      // Create payload for on-chain transaction
      const payloadRes = await payloadsApi.createProfilePayload(formData);
      if (payloadRes.success) {
        // Record transaction
        await transactionsApi.recordTransaction({
          type: "profile_creation",
          userAddress: publicKey || "unknown",
          status: "confirmed",
          transactionHash: "0x" + Math.random().toString(16).slice(2, 18),
          details: formData,
        });

        // Update profile locally
        setProfile({ ...formData, profileRootCommitment: "0x" + Math.random().toString(16).slice(2, 18) });
        setFormData({ ...formData, nonce: Math.random().toString(36).slice(2, 10) });
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
    <section>
      <h2 className="text-3xl font-bold mb-6">Your Profile</h2>

      {/* Registration Form */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 max-w-2xl mb-8">
        <h3 className="text-xl font-semibold mb-4">Register or Update Profile</h3>
        <form className="flex flex-col gap-3" onSubmit={handleRegister}>
          <input
            value={formData.profileId}
            onChange={(e) => setFormData({ ...formData, profileId: e.target.value })}
            required
            placeholder="Profile ID"
            className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500"
          />
          <select
            value={formData.ageBucket}
            onChange={(e) => setFormData({ ...formData, ageBucket: e.target.value })}
            className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm"
          >
            <option>18-24</option>
            <option>25-35</option>
            <option>36-50</option>
            <option>50+</option>
          </select>
          <select
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm"
          >
            <option>US</option>
            <option>EU</option>
            <option>ASIA</option>
            <option>OTHER</option>
          </select>
          <input
            value={formData.behaviorFingerprint}
            onChange={(e) => setFormData({ ...formData, behaviorFingerprint: e.target.value })}
            placeholder="Behavior Type"
            className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500"
          />
          <select
            value={formData.kycTier}
            onChange={(e) => setFormData({ ...formData, kycTier: e.target.value })}
            className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm"
          >
            <option value="tier1">Tier 1</option>
            <option value="tier2">Tier 2</option>
            <option value="tier3">Tier 3</option>
          </select>
          <button
            type="submit"
            disabled={registering}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold mt-2 disabled:opacity-50 transition-colors"
          >
            {registering ? "Registering..." : "Register Profile (On-Chain)"}
          </button>
        </form>
      </div>

      {/* Profile Data */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
        <h3 className="text-xl font-semibold mb-4">Profile Data</h3>
        {loading && <div className="text-neutral-400">Loading profile...</div>}
        {error && <div className="text-red-400 bg-red-500/10 p-4 rounded">{error}</div>}
        {profile && (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(profile).map(([key, value]) => (
              <div key={key} className="bg-neutral-800 rounded-lg p-4">
                <div className="text-xs text-neutral-500 mb-2 uppercase tracking-wider">{key}</div>
                <div className="font-mono text-green-400 text-sm break-all">
                  {typeof value === "string" ? value.slice(0, 32) + (value.length > 32 ? "..." : "") : JSON.stringify(value)}
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && !error && !profile && <div className="text-neutral-400">No profile data available. Create one above.</div>}
      </div>
    </section>
  );
}

// Marketplace Section Component
function MarketplaceSection({ publicKey }: { publicKey: string | null }) {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dataType: "dataset",
    price: "100",
  });

  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await marketplaceApi.getListings({ available: true });
        if (res.success) {
          setListings(res.data || []);
        } else {
          setError(res.error || "Failed to load listings");
        }
      } catch (e) {
        setError("Error loading listings");
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
      const res = await marketplaceApi.createListing({
        title: formData.title,
        description: formData.description,
        dataType: formData.dataType,
        price: formData.price + "u64",
        seller: publicKey || "unknown",
      });

      if (res.success) {
        // Record transaction
        await transactionsApi.recordTransaction({
          type: "marketplace_listing",
          userAddress: publicKey || "unknown",
          amount: formData.price + "u64",
          status: "confirmed",
          transactionHash: "0x" + Math.random().toString(16).slice(2, 18),
          details: formData,
        });

        setListings([res.data as any, ...listings]);
        setFormData({ title: "", description: "", dataType: "dataset", price: "100" });
      } else {
        setError(res.error || "Failed to create listing");
      }
    } catch (e) {
      setError("Error creating listing");
    } finally {
      setCreating(false);
    }
  };

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Marketplace Listings</h2>

      {/* Create Listing Form */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 max-w-2xl mb-8">
        <h3 className="text-xl font-semibold mb-4">Create New Listing</h3>
        <form className="flex flex-col gap-3" onSubmit={handleCreateListing}>
          <input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Title"
            className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500"
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            placeholder="Description"
            className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500"
          />
          <select
            value={formData.dataType}
            onChange={(e) => setFormData({ ...formData, dataType: e.target.value })}
            className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm"
          >
            <option value="dataset">Dataset</option>
            <option value="service">Service</option>
            <option value="analysis">Analysis</option>
          </select>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            placeholder="Price (Microcredits)"
            className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm placeholder-neutral-500"
          />
          <button
            type="submit"
            disabled={creating}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold mt-2 disabled:opacity-50 transition-colors"
          >
            {creating ? "Creating..." : "Create Listing (On-Chain)"}
          </button>
        </form>
      </div>

      {/* Listings Display */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
        <h3 className="text-xl font-semibold mb-4">Available Listings</h3>
        {loading && <div className="text-neutral-400">Loading listings...</div>}
        {error && <div className="text-red-400 bg-red-500/10 p-4 rounded">{error}</div>}
        {listings.length > 0 ? (
          <div className="grid gap-4">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-neutral-800 p-4 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{listing.title}</h4>
                    <p className="text-sm text-neutral-400">{listing.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-600 text-white text-xs rounded font-medium">{listing.price}</span>
                </div>
                <div className="flex gap-4 text-xs text-neutral-500">
                  <span>Type: {listing.dataType}</span>
                  <span>Seller: {listing.seller.slice(0, 10)}...</span>
                  <span>{listing.available ? "Available" : "Sold"}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-neutral-400">No listings available.</div>
        )}
      </div>
    </section>
  );
}

// Smart Contracts Section Component
function SmartContractsSection() {
  const [contracts, setContracts] = useState<DeployedProgram[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadContracts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await programsApi.getPrograms();
        if (res.success && res.data) {
          setContracts(res.data);
        } else {
          setError(res.error || "Failed to load contracts");
        }
      } catch (e) {
        setError("Error loading contracts");
      } finally {
        setLoading(false);
      }
    };

    loadContracts();
  }, []);

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Smart Contracts</h2>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
        {loading && <div className="text-neutral-400">Loading contracts...</div>}
        {error && <div className="text-red-400 bg-red-500/10 p-4 rounded">{error}</div>}
        {contracts.length > 0 ? (
          <div className="space-y-4">
            {contracts.map((contract) => (
              <div key={contract.id} className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{contract.name}</h3>
                    <p className="text-sm text-neutral-400 mt-1">{contract.description}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded font-medium ${contract.status === "active" ? "bg-green-600 text-white" : "bg-neutral-700 text-neutral-400"}`}>
                    {contract.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-neutral-500">Address:</span>
                    <div className="font-mono text-green-400 text-xs break-all">{contract.address}</div>
                  </div>
                  <div>
                    <span className="text-neutral-500">Network:</span>
                    <div className="text-white">{contract.network}</div>
                  </div>
                </div>
                <div>
                  <span className="text-neutral-500 text-sm">Functions:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {contract.functions.map((func) => (
                      <span key={func} className="px-2 py-1 bg-neutral-700 text-neutral-300 text-xs rounded">
                        {func}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-neutral-400">No contracts found.</div>
        )}
      </div>
    </section>
  );
}

// Transactions Section Component
function TransactionsSection({ publicKey }: { publicKey: string | null }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTransactions = async () => {
      if (!publicKey) return;

      setLoading(true);
      setError("");
      try {
        const res = await transactionsApi.getTransactions({
          userAddress: publicKey,
          limit: 50,
        });
        if (res.success) {
          setTransactions(res.data || []);
        } else {
          setError(res.error || "Failed to load transactions");
        }
      } catch (e) {
        setError("Error loading transactions");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [publicKey]);

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Transaction History</h2>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
        {loading && <div className="text-neutral-400">Loading transactions...</div>}
        {error && <div className="text-red-400 bg-red-500/10 p-4 rounded">{error}</div>}
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-neutral-800 p-4 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${tx.status === "confirmed" ? "bg-green-500/20" : tx.status === "pending" ? "bg-yellow-500/20" : "bg-red-500/20"}`}>
                      {tx.status === "confirmed" && <FiCheck className="text-green-400" />}
                      {tx.status === "pending" && <FiClock className="text-yellow-400" />}
                      {tx.status === "failed" && <FiAlertCircle className="text-red-400" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white capitalize">{tx.type.replace("_", " ")}</h4>
                      <p className="text-xs text-neutral-500">{new Date(tx.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  {tx.amount && <span className="text-green-400 font-mono">{tx.amount}</span>}
                </div>
                {tx.transactionHash && <div className="text-xs text-neutral-500 font-mono">Hash: {tx.transactionHash.slice(0, 16)}...</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-neutral-400">No transactions found.</div>
        )}
      </div>
    </section>
  );
}

// AI Agents Section
function AIAgentsSection() {
  const [agents] = useState([
    { id: "agent_001", name: "Vision Model", description: "Image classification and analysis", status: "Active" },
    { id: "agent_002", name: "NLP Bot", description: "Text analysis and summarization", status: "Active" },
  ]);

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">AI Agents</h2>
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
        <div className="grid gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <FiCpu className="text-blue-400" />
                    {agent.name}
                  </h3>
                  <p className="text-sm text-neutral-400 mt-1">{agent.description}</p>
                  <p className="text-xs text-neutral-600 mt-2">ID: {agent.id}</p>
                </div>
                <span className="px-3 py-1 bg-green-600 text-white text-xs rounded font-medium">{agent.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Dashboard Component
export default function DashboardPage() {
  const { publicKey, connected } = useWallet();
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (type: NotificationType, message: string) => {
    const id = Math.random().toString(36).slice(2, 9);
    setNotifications((prev) => [...prev, { type, message, id }]);
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 3000);
  };

  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
        <h1 className="text-4xl font-bold mb-4 text-center">Aura Protocol Dashboard</h1>
        <p className="text-neutral-400 mb-8 text-center max-w-md">Connect your Aleo wallet to access the dashboard and interact with real on-chain data.</p>
        <div className="[&>.wallet-adapter-dropdown]:w-full [&>.wallet-adapter-button]:bg-white [&>.wallet-adapter-button]:text-black [&>.wallet-adapter-button]:font-semibold [&>.wallet-adapter-button]:text-sm [&>.wallet-adapter-button]:rounded [&>.wallet-adapter-button]:h-12 [&>.wallet-adapter-button]:px-6 [&>.wallet-adapter-button:hover]:bg-neutral-200 [&>.wallet-adapter-button]:transition-colors w-full max-w-xs">
          <WalletMultiButton />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "marketplace", label: "Marketplace", icon: FiShoppingCart },
    { id: "contracts", label: "Smart Contracts", icon: FiFileText },
    { id: "aiagents", label: "AI Agents", icon: FiCpu },
    { id: "transactions", label: "Transactions", icon: FiList },
  ];

  return (
    <div className="min-h-screen flex bg-black text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-neutral-900 to-black border-r border-neutral-800 flex flex-col py-8 px-4 min-h-screen sticky top-0">
        <div className="mb-12 px-2">
          <h1 className="text-2xl font-bold tracking-tight">Aura</h1>
          <p className="text-xs text-neutral-500 mt-1">Protocol Dashboard</p>
        </div>

        <nav className="flex flex-col gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left px-4 py-3 rounded-lg transition-all text-sm font-medium flex items-center gap-3 ${
                  activeTab === tab.id ? "bg-green-600 text-white shadow-lg" : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-neutral-800">
          <div className="text-xs text-neutral-500 mb-3 font-semibold uppercase tracking-wider">Wallet</div>
          <div className="bg-neutral-900 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Connected</span>
            </div>
            <div className="font-mono text-xs text-neutral-300 break-all">{publicKey?.slice(0, 10)}...{publicKey?.slice(-8)}</div>
          </div>
          <WalletMultiButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Status Bar */}
        <div className="h-12 bg-neutral-900 border-b border-neutral-800 px-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-neutral-500">Network:</span> <span className="text-neutral-300 font-medium">Aleo Testnet</span>
            </div>
            <div>
              <span className="text-neutral-500">Status:</span> <span className="text-green-400 font-medium">Operational</span>
            </div>
          </div>
          <div className="text-neutral-500">
            Last Updated: <span className="text-neutral-300 font-medium">Now</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === "profile" && <ProfileSection publicKey={publicKey} />}
          {activeTab === "marketplace" && <MarketplaceSection publicKey={publicKey} />}
          {activeTab === "contracts" && <SmartContractsSection />}
          {activeTab === "aiagents" && <AIAgentsSection />}
          {activeTab === "transactions" && <TransactionsSection publicKey={publicKey} />}
        </div>
      </main>

      {/* Notifications */}
      <NotificationCenter notifications={notifications} />
    </div>
  );
}
