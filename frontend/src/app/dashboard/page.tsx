export default function DashboardOverview() {
  return (
    <div className="max-w-4xl max-h-full">
      <div className="mb-12">
        <h2 className="text-3xl font-light mb-2">System Overview</h2>
        <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">Connect your wallet to unseal parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-8 border border-white/10 bg-black relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-4">Network Status</h3>
          <div className="text-4xl font-light">Aleo Testnet 3</div>
          <div className="mt-4 inline-flex items-center space-x-2 text-xs text-green-400 font-mono">
            <span>PING 42ms</span>
          </div>
        </div>

        <div className="p-8 border border-white/10 bg-black relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-4">Your Escrow Balance</h3>
          <div className="text-4xl font-light">-- Credits</div>
          <div className="mt-4 text-xs text-neutral-600 font-mono uppercase">Connect wallet to index block record</div>
        </div>
      </div>
      
      <div className="p-10 border border-white/10 bg-white/[0.02]">
        <h3 className="text-lg font-semibold mb-2">1. Initialize Identity</h3>
        <p className="text-sm text-neutral-400 font-light mb-4">Before transacting on the data market or opening inference channels, your address must commit to a role.</p>
        <a href="/dashboard/identity" className="inline-block bg-white text-black px-6 py-2 text-xs font-mono uppercase tracking-widest hover:bg-neutral-200 transition-colors">Go to Console</a>
      </div>
    </div>
  );
}
