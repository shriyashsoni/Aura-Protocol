import Link from "next/link";

export default function WhitepaperPage() {
	return (
		<div className="min-h-screen bg-black text-white p-8">
			<div className="max-w-4xl mx-auto space-y-6">
				<Link href="/" className="text-sm text-neutral-400 hover:text-white">
					Back to Home
				</Link>
				<h1 className="text-4xl font-bold">Aura Protocol Whitepaper</h1>
				<p className="text-neutral-300">
					This page contains the protocol documentation, architecture, and deployed smart contract references.
				</p>
			</div>
		</div>
	);
}
