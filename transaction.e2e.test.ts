import { BitcoinTransactionEngine } from '../../src/core/bitcoinEngine';
import { TransactionBroadcaster } from '../../src/services/broadcaster';

describe('End-to-End Transaction Flow', () => {
    it('should build, sign, and broadcast a real transaction', async () => {
        const engine = new BitcoinTransactionEngine();
        const broadcaster = new TransactionBroadcaster();

        const { txHex, txid } = await engine.buildAndSignTransaction(
            process.env.TEST_PRIVATE_KEY!,
            process.env.TEST_RECIPIENT!,
            0.0001
        );

        expect(txHex).toMatch(/^[a-f0-9]+$/);
        expect(txid).toMatch(/^[a-f0-9]{64}$/);

        const broadcastTxid = await broadcaster.broadcast(txHex);
        expect(broadcastTxid).toBe(txid);
    }, 30000);
});