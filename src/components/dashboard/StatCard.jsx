import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ label, value, subValue, trend, icon: Icon, color = "mint" }) => {
    const isPositive = trend === 'up';

    const colorClasses = {
        mint: 'text-hyper-mint',
        red: 'text-hyper-red',
        orange: 'text-hyper-orange',
        brand: 'text-hyper-brand',
    };

    const activeColor = colorClasses[color] || colorClasses.mint;

    return (
        <div className="bg-hyper-card border border-hyper-border rounded p-4 hover:border-hyper-mint/30 transition-all select-none">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        {Icon && <Icon size={14} className="text-hyper-text" />}
                        <h3 className="text-hyper-text text-[10px] font-bold uppercase tracking-widest">{label}</h3>
                    </div>
                    <div className={`text-xl font-bold font-mono tracking-tight ${activeColor}`}>
                        {value}
                    </div>
                </div>

                {trend && (
                    <div className={`flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded ${isPositive ? 'text-hyper-mint bg-hyper-mint/10' : 'text-hyper-red bg-hyper-red/10'
                        }`}>
                        {isPositive ? '+' : '-'}12.5%
                    </div>
                )}
            </div>

            <div className="mt-2 h-0.5 w-full bg-hyper-border rounded-full overflow-hidden">
                <div className={`h-full w-2/3 ${activeColor.replace('text-', 'bg-')}`}></div>
            </div>
        </div>
    );
};
export default StatCard;
