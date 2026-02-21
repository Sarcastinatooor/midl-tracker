import React from 'react';
import { ArrowLeftRight, Box, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveFeed = ({ transactions = [] }) => {
    return (
        <div className="bg-hyper-card border border-hyper-border rounded-lg overflow-hidden flex flex-col h-full shadow-lg">
            <div className="p-3 border-b border-hyper-border flex items-center justify-between bg-black/40">
                <h2 className="text-xs font-bold text-hyper-header uppercase tracking-wider flex items-center gap-2">
                    <Activity size={12} className="text-hyper-mint" />
                    The Tape
                </h2>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-hyper-mint animate-pulse"></div>
                    <span className="text-[10px] font-mono text-hyper-mint">LIVE</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0a0a0a] sticky top-0 z-10">
                        <tr>
                            <th className="py-2 px-3 text-[10px] uppercase font-bold text-hyper-text border-b border-hyper-border w-20">Time</th>
                            <th className="py-2 px-3 text-[10px] uppercase font-bold text-hyper-text border-b border-hyper-border">Type</th>
                            <th className="py-2 px-3 text-[10px] uppercase font-bold text-hyper-text border-b border-hyper-border text-right">Value (BTC)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-hyper-border/50">
                        <AnimatePresence initial={false}>
                            {transactions.map((tx) => (
                                <TransactionRow key={tx.hash || Math.random()} tx={tx} />
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="text-center py-10 text-hyper-text/50 text-xs font-mono">
                                        Waiting for data...
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const TransactionRow = ({ tx }) => {
    const isBuy = parseFloat(tx.value) > 0.5;

    return (
        <motion.tr
            layout
            initial={{ opacity: 0, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            animate={{ opacity: 1, backgroundColor: "transparent" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="group hover:bg-white/5 cursor-pointer"
        >
            <td className="py-1.5 px-3 whitespace-nowrap">
                <span className="text-xs font-mono text-hyper-text/70">{tx.time ? tx.time.split(' ')[0] : 'Now'}</span>
            </td>
            <td className="py-1.5 px-3">
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${tx.type === 'contract' ? 'text-hyper-brand' : 'text-hyper-orange'}`}>
                        {tx.type === 'contract' ? 'EXEC' : 'TX'}
                    </span>
                    <span className="text-[10px] font-mono text-hyper-text opacity-50 hidden sm:inline-block">
                        {tx.hash ? tx.hash.slice(0, 4) : '---'}
                    </span>
                </div>
            </td>
            <td className="py-1.5 px-3 text-right">
                <span className={`text-xs font-mono font-bold ${isBuy ? 'text-hyper-mint' : 'text-hyper-red'}`}>
                    {tx.value}
                </span>
            </td>
        </motion.tr>
    );
};

export default LiveFeed;
