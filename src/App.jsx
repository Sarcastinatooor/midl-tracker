import React, { useState, useEffect } from 'react';
import AppShell from './components/layout/AppShell';
import StatCard from './components/dashboard/StatCard';
import LiveFeed from './components/dashboard/LiveFeed';
import PulseOrb from './components/visualizer/PulseOrb';
import AddressProfile from './components/explorer/AddressProfile';
import { Box, Layers, Zap, Activity } from 'lucide-react';
import { useWallet } from './hooks/useWallet';
import { midlService } from './services/midl';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    height: 'Loading...',
    tps: '--',
    gas: '--',
    runes: '--'
  });
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchAddress, setSearchAddress] = useState(null);

  const { address, isConnecting, error, needsInstall, connect, disconnect, dismissInstall, openInstallPage } = useWallet();

  useEffect(() => {
    const unsubscribe = midlService.subscribe((newTx) => {
      setTransactions(prev => [newTx, ...prev].slice(0, 50));
    });

    const fetchStats = async () => {
      const block = await midlService.getLatestBlock();
      const network = await midlService.getNetworkStats();
      setStats({
        height: block.height.toLocaleString(),
        tps: network.tps,
        gas: `${network.gas} sat/vb`,
        runes: network.runesActive.toLocaleString()
      });
    };

    fetchStats();
    const statInterval = setInterval(fetchStats, 5000);

    return () => {
      unsubscribe();
      clearInterval(statInterval);
    };
  }, []);

  const handleSearch = (addr) => {
    setSearchAddress(addr);
    setCurrentView('explorer');
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    if (view === 'dashboard') {
      setSearchAddress(null);
    }
  };

  return (
    <AppShell
      address={address}
      isConnecting={isConnecting}
      onConnect={connect}
      onDisconnect={disconnect}
      onSearch={handleSearch}
      currentView={currentView}
      onNavigate={handleNavigate}
      needsInstall={needsInstall}
      dismissInstall={dismissInstall}
      openInstallPage={openInstallPage}
      walletError={error}
    >
      {currentView === 'explorer' && searchAddress ? (
        <AddressProfile
          searchAddress={searchAddress}
          onBack={() => handleNavigate('dashboard')}
        />
      ) : currentView === 'explorer' ? (
        /* Explorer landing — prompt to search */
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 rounded-2xl bg-hyper-mint/10 border border-hyper-mint/20 flex items-center justify-center mb-6">
            <Activity size={28} className="text-hyper-mint" />
          </div>
          <h2 className="text-xl font-bold text-hyper-header mb-2">Address Explorer</h2>
          <p className="text-sm text-hyper-text max-w-md">
            Search any Bitcoin or Midl address to view equity, holdings, and transaction history.
          </p>
          <p className="text-xs text-hyper-text/50 mt-4 font-mono">
            Try: bc1p4x2ryj03f5h0jy5gl3dfy5m0hkkk9gg32lcnq
          </p>
        </div>
      ) : (
        /* Dashboard */
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <StatCard label="Height" value={stats.height} subValue="Just now" icon={Box} color="mint" />
            <StatCard label="Gas" value={stats.gas} subValue="Low" icon={Zap} color="orange" />
            <StatCard label="TPS" value={stats.tps} subValue="Peak: 120" icon={Activity} color="brand" trend="up" />
            <StatCard label="Runes" value={stats.runes} subValue="+12" icon={Layers} color="red" />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)]">
            <div className="lg:col-span-8 h-full bg-hyper-card border border-hyper-border rounded-lg overflow-hidden group flex flex-col">
              <div className="p-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-hyper-mint animate-pulse"></div>
                <span className="text-xs font-mono text-hyper-mint">LIVE_NET_VISUALIZER</span>
              </div>
              <div className="flex-1 min-h-0 w-full relative">
                <PulseOrb intensity={0.5} />
              </div>
            </div>
            <div className="lg:col-span-4 h-full">
              <LiveFeed transactions={transactions} />
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}

export default App;
