import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Copy, ExternalLink, Clock, Hash, ChevronLeft } from 'lucide-react';
import { addressService } from '../../services/addressService';

const TIMEFRAMES = ['24h', '7d', '30d', 'All'];

const AddressProfile = ({ searchAddress, onBack }) => {
    const [info, setInfo] = useState(null);
    const [holdings, setHoldings] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [timeframe, setTimeframe] = useState('30d');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!searchAddress) return;
        setInfo(addressService.getAddressInfo(searchAddress));
        setHoldings(addressService.getTokenHoldings(searchAddress));
    }, [searchAddress]);

    useEffect(() => {
        if (!searchAddress) return;
        setChartData(addressService.getEquityHistory(searchAddress, timeframe));
    }, [searchAddress, timeframe]);

    const copyAddress = () => {
        navigator.clipboard.writeText(searchAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    if (!info) return <div className="text-hyper-text text-sm font-mono p-8">Loading...</div>;

    const totalValue = holdings.reduce((sum, t) => sum + parseFloat(t.value), 0);

    return (
        <div className="space-y-4">
            {/* Back Button */}
            <button onClick={onBack} className="flex items-center gap-2 text-xs text-hyper-text hover:text-hyper-mint transition-colors mb-2">
                <ChevronLeft size={14} />
                <span>Back to Dashboard</span>
            </button>

            {/* Address Header */}
            <div className="bg-hyper-card border border-hyper-border rounded-lg p-5">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-hyper-mint/30 to-hyper-brand/30 border border-hyper-border flex items-center justify-center text-xl font-bold text-hyper-mint">
                        {searchAddress.slice(-2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-mono text-hyper-header truncate max-w-xs">
                                {searchAddress.slice(0, 12)}...{searchAddress.slice(-8)}
                            </span>
                            <button onClick={copyAddress} className="text-hyper-text hover:text-hyper-mint transition-colors" title="Copy">
                                <Copy size={12} />
                            </button>
                            {copied && <span className="text-[10px] text-hyper-mint">Copied!</span>}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${info.badge === 'Whale' ? 'bg-hyper-mint/10 text-hyper-mint' :
                                    info.badge === 'Dolphin' ? 'bg-hyper-brand/10 text-hyper-brand' :
                                        'bg-hyper-orange/10 text-hyper-orange'
                                }`}>
                                {info.badge === 'Whale' ? '🐋' : info.badge === 'Dolphin' ? '🐬' : info.badge === 'Fish' ? '🐟' : '🦐'} {info.badge}
                            </span>
                            <span className="text-[10px] text-hyper-text flex items-center gap-1">
                                <Clock size={10} /> {info.daysSinceFirst}d active
                            </span>
                            <span className="text-[10px] text-hyper-text flex items-center gap-1">
                                <Hash size={10} /> {info.txCount.toLocaleString()} txns
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Equity + Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Equity Summary - 4 cols */}
                <div className="lg:col-span-4 bg-hyper-card border border-hyper-border rounded-lg p-5">
                    <div className="text-[10px] text-hyper-text uppercase tracking-widest font-bold mb-2">Total Equity</div>
                    <div className="text-3xl font-bold text-hyper-header font-mono mb-1">
                        ${parseFloat(info.equityUSD).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-sm text-hyper-mint font-mono">{info.equity} BTC</div>

                    {/* Mini Stats */}
                    <div className="mt-6 space-y-3">
                        <div className="flex justify-between text-xs">
                            <span className="text-hyper-text">Tokens Held</span>
                            <span className="text-hyper-header font-mono">{holdings.length}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-hyper-text">Total Txns</span>
                            <span className="text-hyper-header font-mono">{info.txCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-hyper-text">Days Active</span>
                            <span className="text-hyper-header font-mono">{info.daysSinceFirst}</span>
                        </div>
                    </div>
                </div>

                {/* Chart - 8 cols */}
                <div className="lg:col-span-8 bg-hyper-card border border-hyper-border rounded-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-[10px] text-hyper-text uppercase tracking-widest font-bold">Combined Equity</div>
                        <div className="flex items-center gap-1">
                            {TIMEFRAMES.map(tf => (
                                <button
                                    key={tf}
                                    onClick={() => setTimeframe(tf)}
                                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${timeframe === tf
                                            ? 'bg-hyper-mint/20 text-hyper-mint border border-hyper-mint/30'
                                            : 'text-hyper-text hover:text-white border border-transparent hover:border-hyper-border'
                                        }`}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>
                    </div>
                    <EquityChart data={chartData} />
                </div>
            </div>

            {/* Token Holdings Table */}
            <div className="bg-hyper-card border border-hyper-border rounded-lg overflow-hidden">
                <div className="p-4 border-b border-hyper-border">
                    <h3 className="text-xs font-bold text-hyper-header uppercase tracking-wider">
                        Holdings ({holdings.length})
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#0a0a0a]">
                            <tr>
                                <th className="py-2.5 px-4 text-[10px] uppercase font-bold text-hyper-text border-b border-hyper-border">Token</th>
                                <th className="py-2.5 px-4 text-[10px] uppercase font-bold text-hyper-text border-b border-hyper-border text-right">Balance</th>
                                <th className="py-2.5 px-4 text-[10px] uppercase font-bold text-hyper-text border-b border-hyper-border text-right">Live Price</th>
                                <th className="py-2.5 px-4 text-[10px] uppercase font-bold text-hyper-text border-b border-hyper-border">Allocation</th>
                                <th className="py-2.5 px-4 text-[10px] uppercase font-bold text-hyper-text border-b border-hyper-border text-right">Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-hyper-border/50">
                            {holdings.map((token) => {
                                const allocation = totalValue > 0 ? (parseFloat(token.value) / totalValue) * 100 : 0;
                                return (
                                    <tr key={token.symbol} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{token.icon}</span>
                                                <div>
                                                    <div className="text-xs font-bold text-hyper-header">{token.symbol}</div>
                                                    <div className="text-[10px] text-hyper-text">{token.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="text-xs font-mono text-hyper-header">{token.balance}</span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="text-xs font-mono text-hyper-text">{token.priceFormatted}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-1.5 bg-hyper-border rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-hyper-mint rounded-full transition-all"
                                                        style={{ width: `${Math.min(allocation, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-[10px] font-mono text-hyper-text w-8">{allocation.toFixed(0)}%</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="text-xs font-mono font-bold text-hyper-mint">
                                                ${parseFloat(token.value).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// ─── Canvas-based Equity Area Chart ──────────────────────────────
const EquityChart = ({ data }) => {
    const canvasRef = useRef(null);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !data || data.length === 0) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const w = rect.width;
        const h = rect.height;
        const padding = { top: 20, right: 10, bottom: 30, left: 60 };

        const drawW = w - padding.left - padding.right;
        const drawH = h - padding.top - padding.bottom;

        ctx.clearRect(0, 0, w, h);

        const values = data.map(d => d.value);
        const min = Math.min(...values) * 0.95;
        const max = Math.max(...values) * 1.05;
        const range = max - min || 1;

        // Grid lines
        ctx.strokeStyle = '#222222';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([4, 4]);
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (drawH / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(w - padding.right, y);
            ctx.stroke();

            // Y labels
            const val = max - (range / 4) * i;
            ctx.fillStyle = '#94a3b8';
            ctx.font = '10px "IBM Plex Mono", monospace';
            ctx.textAlign = 'right';
            ctx.fillText(`$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, padding.left - 8, y + 3);
        }
        ctx.setLineDash([]);

        // Data points
        const points = data.map((d, i) => ({
            x: padding.left + (i / (data.length - 1)) * drawW,
            y: padding.top + (1 - (d.value - min) / range) * drawH,
        }));

        // Area fill
        const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
        gradient.addColorStop(0, 'rgba(74, 222, 128, 0.25)');
        gradient.addColorStop(1, 'rgba(74, 222, 128, 0.02)');

        ctx.beginPath();
        ctx.moveTo(points[0].x, h - padding.bottom);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, h - padding.bottom);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Line
        ctx.beginPath();
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 1.5;
        ctx.lineJoin = 'round';
        points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.stroke();

        // X labels (show ~6 evenly spaced)
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        const step = Math.max(1, Math.floor(data.length / 6));
        for (let i = 0; i < data.length; i += step) {
            ctx.fillText(data[i].label, points[i].x, h - 8);
        }
    }, [data]);

    useEffect(() => {
        draw();
        const handleResize = () => draw();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [draw]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-48 lg:h-56"
            style={{ display: 'block' }}
        />
    );
};

export default AddressProfile;
