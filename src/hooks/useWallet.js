import { useState, useCallback } from 'react';

const XVERSE_CHROME_URL = 'https://chromewebstore.google.com/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg';

/**
 * useWallet — handles Xverse wallet connection with install detection.
 * 
 * Flow:
 * 1. Check if Xverse extension is installed (window.XverseProviders or window.BitcoinProvider)
 * 2. If NOT installed → set `needsInstall = true` so UI can show install prompt
 * 3. If installed → use sats-connect to request accounts
 */
export const useWallet = () => {
    const [address, setAddress] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);
    const [needsInstall, setNeedsInstall] = useState(false);

    const isXverseInstalled = () => {
        return !!(
            window.XverseProviders?.BitcoinProvider ||
            window.BitcoinProvider ||
            window.btc
        );
    };

    const connect = useCallback(async () => {
        setError(null);

        // Step 1: Check if Xverse is installed
        if (!isXverseInstalled()) {
            setNeedsInstall(true);
            return;
        }

        setIsConnecting(true);
        setNeedsInstall(false);

        try {
            const satsConnect = await import('sats-connect');
            const AddressPurpose = satsConnect.AddressPurpose;

            // Try v4 API first (Wallet.request)
            const Wallet = satsConnect.default || satsConnect;
            if (Wallet && typeof Wallet.request === 'function') {
                const response = await Wallet.request('getAccounts', {
                    purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
                    message: 'Connect to MidlTracker',
                });

                if (response.status === 'success') {
                    const paymentAccount = response.result.find(
                        (acc) => acc.purpose === AddressPurpose.Payment || acc.purpose === 'payment'
                    );
                    if (paymentAccount) {
                        setAddress(paymentAccount.address);
                    } else if (response.result.length > 0) {
                        setAddress(response.result[0].address);
                    }
                } else {
                    setError(response.error?.message || 'Connection declined');
                }
            }
            // Fallback: v3 API (getAddress with callbacks)
            else if (typeof satsConnect.getAddress === 'function') {
                await new Promise((resolve, reject) => {
                    satsConnect.getAddress({
                        payload: {
                            purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
                            message: 'Connect to MidlTracker',
                            network: { type: 'Mainnet' },
                        },
                        onFinish: (response) => {
                            const paymentAddr = response.addresses.find(
                                a => a.purpose === AddressPurpose.Payment || a.purpose === 'payment'
                            );
                            if (paymentAddr) setAddress(paymentAddr.address);
                            else if (response.addresses.length > 0) setAddress(response.addresses[0].address);
                            resolve();
                        },
                        onCancel: () => {
                            setError('Connection cancelled by user');
                            resolve();
                        },
                    });
                });
            } else {
                setError('sats-connect API not available');
            }
        } catch (err) {
            console.error('Wallet connection error:', err);
            setError(err.message || 'Failed to connect wallet');
        } finally {
            setIsConnecting(false);
        }
    }, []);

    const disconnect = useCallback(() => {
        setAddress(null);
        setError(null);
        setNeedsInstall(false);
    }, []);

    const dismissInstall = useCallback(() => {
        setNeedsInstall(false);
    }, []);

    const openInstallPage = useCallback(() => {
        window.open(XVERSE_CHROME_URL, '_blank');
    }, []);

    return {
        address,
        isConnecting,
        error,
        needsInstall,
        connect,
        disconnect,
        dismissInstall,
        openInstallPage,
    };
};
