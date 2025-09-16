import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const TransactionWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [txid, setTxid] = useState('');

    const handleSubmit = async () => {
        setStatus('loading');
        try {
            // Call backend API
            const res = await fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            setTxid(data.txid);
            setStatus('success');
        } catch {
            setStatus('error');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {status === 'loading' && (
                <div className="elite-loader">
                    <h3>⚡ BROADCASTING TO NODES</h3>
                    <p>Simulating global consensus...</p>
                </div>
            )}
            {status === 'success' && (
                <div className="elite-success">
                    <h2>💎 TRANSACTION COMPLETE</h2>
                    <p>TXID: {txid}</p>
                    <button onClick={() => window.open(`https://mempool.space/tx/${txid}`)}>
                        VERIFY ON EXPLORER
                    </button>
                </div>
            )}
            {/* Form steps here */}
        </motion.div>
    );
};