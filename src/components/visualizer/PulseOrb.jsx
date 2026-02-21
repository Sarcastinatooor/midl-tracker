import React from 'react';
import { motion } from 'framer-motion';

const PulseOrb = ({ intensity = 0.5 }) => {
    return (
        <div className="flex items-center justify-center w-full h-full relative overflow-hidden">

            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

            {/* The Core Orb */}
            <div className="relative z-10">
                {/* Outer Glow */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-full bg-hyper-mint/20 blur-3xl"
                />

                {/* Inner Core */}
                <div className="relative w-32 h-32 rounded-full bg-black border border-hyper-mint/50 shadow-[0_0_40px_rgba(74,222,128,0.2)] flex items-center justify-center">
                    {/* Spinning Rings */}
                    <div className="absolute inset-1 rounded-full border border-hyper-mint/30 w-30 h-30 animate-[spin_8s_linear_infinite]"
                        style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }} />
                    <div className="absolute inset-4 rounded-full border border-hyper-brand/50 w-24 h-24 animate-[spin_12s_linear_infinite_reverse]"
                        style={{ borderLeftColor: 'transparent', borderRightColor: 'transparent' }} />

                    <div className="text-center z-10">
                        <div className="text-2xl font-bold text-white tracking-widest font-mono">MIDL</div>
                        <div className="text-[9px] text-hyper-mint uppercase tracking-[0.2em] animate-pulse">Scanning</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PulseOrb;
