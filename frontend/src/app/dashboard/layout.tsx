import Link from "next/link";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-screen bg-black text-white">
			<header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
				<h1 className="text-lg font-semibold">Aura Dashboard</h1>
				<nav className="flex gap-4 text-sm text-neutral-300">
					<Link href="/dashboard">Overview</Link>
					<Link href="/dashboard/identity">Identity</Link>
					<Link href="/dashboard/market">Market</Link>
					<Link href="/dashboard/inference">Inference</Link>
					<Link href="/dashboard/vault">Vault</Link>
				</nav>
			</header>
			<main className="p-6">{children}</main>
		</div>
	);
}
