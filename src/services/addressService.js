/**
 * Address Service — Mock data for address lookup.
 * Returns realistic BTC address portfolio data.
 * Can be swapped for real Midl/Bitcoin API later.
 */

const TOKENS = [
    { symbol: 'BTC', name: 'Bitcoin', price: 92430, icon: '₿' },
    { symbol: 'RUNE•MIDL', name: 'Midl Rune', price: 0.0342, icon: '◆' },
    { symbol: 'ORDI', name: 'Ordinals', price: 28.50, icon: '⊛' },
    { symbol: 'SATS', name: 'SATS (1000)', price: 0.00032, icon: '✧' },
    { symbol: 'PIPE', name: 'Pipe Protocol', price: 1.84, icon: '⊡' },
    { symbol: 'ATOM', name: 'Atomicals', price: 12.30, icon: '⚛' },
];

// Deterministic random seed from address string
function seedFromAddress(addr) {
    let hash = 0;
    for (let i = 0; i < addr.length; i++) {
        hash = ((hash << 5) - hash) + addr.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function seededRandom(seed) {
    let s = seed;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

export const addressService = {
    getAddressInfo(addr) {
        const seed = seedFromAddress(addr);
        const rng = seededRandom(seed);
        const equity = rng() * 50 + 0.5; // 0.5 - 50.5 BTC
        const equityUSD = equity * 92430;
        const days = Math.floor(rng() * 1000) + 30;

        let badge = 'Plankton';
        if (equity > 10) badge = 'Whale';
        else if (equity > 5) badge = 'Dolphin';
        else if (equity > 1) badge = 'Fish';
        else if (equity > 0.1) badge = 'Shrimp';

        return {
            address: addr,
            equity: equity.toFixed(4),
            equityUSD: equityUSD.toFixed(2),
            badge,
            daysSinceFirst: days,
            txCount: Math.floor(rng() * 5000) + 10,
        };
    },

    getEquityHistory(addr, timeframe = '30d') {
        const seed = seedFromAddress(addr);
        const rng = seededRandom(seed + timeframe.length);

        const points = {
            '24h': 24,
            '7d': 7 * 24,
            '30d': 30,
            'All': 365,
        };

        const count = points[timeframe] || 30;
        const baseValue = rng() * 40000 + 5000;
        const data = [];
        let val = baseValue;

        for (let i = 0; i < count; i++) {
            const volatility = timeframe === '24h' ? 0.01 : 0.03;
            val = val * (1 + (rng() - 0.48) * volatility);
            val = Math.max(val, 100);

            const now = new Date();
            let label;
            if (timeframe === '24h') {
                const d = new Date(now - (count - i) * 3600000);
                label = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else if (timeframe === '7d') {
                const d = new Date(now - (count - i) * 3600000);
                label = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
            } else {
                const d = new Date(now - (count - i) * 86400000);
                label = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
            }

            data.push({ label, value: val });
        }
        return data;
    },

    getTokenHoldings(addr) {
        const seed = seedFromAddress(addr);
        const rng = seededRandom(seed + 42);

        return TOKENS.map(token => {
            const balance = token.symbol === 'BTC'
                ? rng() * 5 + 0.001
                : rng() * 10000 + 1;
            const value = balance * token.price;

            return {
                ...token,
                balance: token.symbol === 'BTC' ? balance.toFixed(6) : Math.floor(balance).toLocaleString(),
                priceFormatted: token.price >= 1 ? `$${token.price.toLocaleString()}` : `$${token.price}`,
                value: value.toFixed(2),
                valueNum: value,
            };
        }).sort((a, b) => b.valueNum - a.valueNum);
    },
};
