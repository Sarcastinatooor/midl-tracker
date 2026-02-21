import React, { useState } from 'react';
import { LayoutDashboard, Activity, Settings, Search, X, Compass, Download, ExternalLink } from 'lucide-react';

const AppShell = ({
    children, address, isConnecting, onConnect, onDisconnect,
    onSearch, currentView, onNavigate,
    needsInstall, dismissInstall, openInstallPage, walletError
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            onSearch?.(searchValue.trim());
            setSearchValue('');
            setSearchFocused(false);
        }
    };

    return (
        <div className="flex h-screen bg-hyper-bg text-hyper-text overflow-hidden font-sans selection:bg-hyper-mint selection:text-black">
            {/* Sidebar */}
            <aside className="w-16 lg:w-56 flex-shrink-0 border-r border-hyper-border flex flex-col pt-4 bg-hyper-card z-20 overflow-hidden">
                <div className="flex items-center justify-center lg:justify-start lg:px-5 mb-6">
                    <img src="/logo.png" alt="MidlTracker" className="w-8 h-8 rounded" />
                    <span className="hidden lg:block ml-3 text-sm font-bold text-hyper-header tracking-wide">
                        Midl<span className="text-hyper-mint">Tracker</span>
                    </span>
                </div>

                <nav className="flex-1 w-full space-y-1 px-2">
                    <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => onNavigate?.('dashboard')} />
                    <NavItem icon={<Compass size={18} />} label="Explorer" active={currentView === 'explorer'} onClick={() => onNavigate?.('explorer')} />
                    <NavItem icon={<Activity size={18} />} label="Network" />
                    <NavItem icon={<Settings size={18} />} label="Settings" />
                </nav>

                <div className="mt-auto p-4 hidden lg:block">
                    <div className="bg-black/40 rounded border border-hyper-border p-3">
                        <div className="text-[10px] text-hyper-text uppercase tracking-wider font-bold mb-1">System Status</div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-hyper-mint animate-pulse"></span>
                            <span className="text-xs text-hyper-mint font-mono">ONLINE</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-hyper-bg">
                {/* Header */}
                <header className="h-14 border-b border-hyper-border flex items-center justify-between px-4 lg:px-6 bg-hyper-card/80 backdrop-blur z-10 gap-4">
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <h1 className="text-sm font-bold text-hyper-header uppercase tracking-wider hidden sm:block">
                            Midl<span className="text-hyper-mint">Tracker</span>
                        </h1>
                        <div className="h-4 w-[1px] bg-hyper-border hidden md:block"></div>
                        <div className="hidden md:flex items-center gap-3 text-xs font-mono">
                            <span className="text-hyper-text">BTC: <span className="text-hyper-mint">$92,430</span></span>
                            <span className="text-hyper-text">GAS: <span className="text-hyper-orange">12 sat/vb</span></span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-4">
                        <div className={`flex items-center gap-2 bg-hyper-bg border rounded px-3 py-1.5 transition-all ${searchFocused ? 'border-hyper-mint shadow-[0_0_10px_rgba(74,222,128,0.15)]' : 'border-hyper-border'}`}>
                            <Search size={14} className="text-hyper-text flex-shrink-0" />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                placeholder="Search address (bc1p...)"
                                className="flex-1 bg-transparent text-xs font-mono text-hyper-header placeholder-hyper-text/50 outline-none"
                            />
                            {searchValue && (
                                <button type="button" onClick={() => setSearchValue('')} className="text-hyper-text hover:text-white">
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Wallet */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {address ? (
                            <button className="flex items-center gap-2 px-3 py-1.5 rounded border border-hyper-border hover:border-hyper-mint/50 bg-hyper-bg transition-all group" onClick={onDisconnect}>
                                <div className="w-2 h-2 rounded-full bg-hyper-mint"></div>
                                <span className="text-xs font-mono text-hyper-header group-hover:text-hyper-mint">
                                    {address.slice(0, 4)}...{address.slice(-4)}
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={onConnect}
                                disabled={isConnecting}
                                className="bg-hyper-mint hover:bg-hyper-mint/90 text-black text-xs font-bold px-4 py-2 rounded uppercase tracking-wide transition-colors shadow-[0_0_15px_rgba(74,222,128,0.3)] hover:shadow-[0_0_20px_rgba(74,222,128,0.5)] disabled:opacity-50"
                            >
                                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                            </button>
                        )}
                    </div>
                </header>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6 relative">
                    {children}
                </div>

                {/* Wallet Error Toast */}
                {walletError && (
                    <div className="absolute bottom-6 right-6 bg-hyper-red/10 border border-hyper-red/30 rounded-lg px-4 py-3 max-w-sm animate-[fadeIn_0.2s_ease]">
                        <p className="text-xs text-hyper-red">{walletError}</p>
                    </div>
                )}
            </main>

            {/* ── Install Xverse Modal ── */}
            {needsInstall && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={dismissInstall}>
                    <div className="bg-hyper-card border border-hyper-border rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl shadow-black/50" onClick={(e) => e.stopPropagation()}>
                        {/* Close */}
                        <button onClick={dismissInstall} className="absolute top-4 right-4 text-hyper-text hover:text-white">
                            <X size={18} />
                        </button>

                        {/* Icon */}
                        <div className="flex justify-center mb-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-hyper-orange/20 to-hyper-brand/20 border border-hyper-border flex items-center justify-center">
                                <Download size={28} className="text-hyper-orange" />
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-bold text-hyper-header text-center mb-2">Install Xverse Wallet</h3>
                        <p className="text-sm text-hyper-text text-center mb-6 leading-relaxed">
                            MidlTracker requires the <span className="text-hyper-orange font-semibold">Xverse</span> browser extension to connect your Bitcoin wallet.
                            Install it from the Chrome Web Store, create or import a wallet, and come back to connect.
                        </p>

                        {/* Actions */}
                        <div className="space-y-3">
                            <button
                                onClick={openInstallPage}
                                className="w-full flex items-center justify-center gap-2 bg-hyper-orange hover:bg-hyper-orange/90 text-black text-sm font-bold px-4 py-3 rounded-lg transition-colors shadow-[0_0_20px_rgba(247,147,26,0.3)]"
                            >
                                <ExternalLink size={16} />
                                Install Xverse Extension
                            </button>
                            <button
                                onClick={() => { dismissInstall(); onConnect(); }}
                                className="w-full text-xs text-hyper-text hover:text-hyper-mint py-2 transition-colors"
                            >
                                I already installed it — try again
                            </button>
                        </div>

                        {/* Help */}
                        <p className="text-[10px] text-hyper-text/50 text-center mt-4">
                            Works with Chrome, Brave, Edge, and Arc browsers
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-2 rounded transition-all duration-200 group
      ${active
                ? 'bg-hyper-mint/10 text-hyper-mint border-l-2 border-hyper-mint'
                : 'text-hyper-text hover:text-white hover:bg-white/5 border-l-2 border-transparent'
            }`}
    >
        <span>{icon}</span>
        <span className="hidden lg:block text-xs font-medium uppercase tracking-wide">{label}</span>
    </button>
);

export default AppShell;
