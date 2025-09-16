import { ECPairInterface, Psbt, networks, payments } from 'bitcoinjs-lib';
import axios from 'axios';

export class BitcoinTransactionEngine {
    private network = networks.bitcoin;

    async buildAndSignTransaction(
        privateKeyWIF: string,
        recipientAddress: string,
        amountBTC: number,
        feeRate?: number
    ): Promise<{ txHex: string; txid: string }> {
        // Validate inputs
        const keyPair = this.loadPrivateKey(privateKeyWIF);
        const senderAddress = this.deriveAddress(keyPair);
        const recipientScript = this.createOutputScript(recipientAddress);

        // Fetch UTXOs
        const utxos = await this.fetchUTXOs(senderAddress);
        if (utxos.length === 0) throw new Error("No UTXOs found");

        // Calculate fees
        const finalFeeRate = feeRate || await this.estimateFeeRate();
        const amountSats = Math.floor(amountBTC * 100000000);
        const { selectedUtxos, changeAmount } = this.selectUTXOs(utxos, amountSats, finalFeeRate);

        // Build PSBT
        const psbt = new Psbt({ network: this.network });
        this.addInputs(psbt, selectedUtxos, keyPair);
        this.addOutputs(psbt, recipientScript, amountSats, senderAddress, changeAmount);

        // Sign
        psbt.signAllInputs(keyPair);
        psbt.finalizeAllInputs();

        const tx = psbt.extractTransaction();
        const txHex = tx.toHex();
        const txid = tx.getId();

        return { txHex, txid };
    }

    // ... other methods: loadPrivateKey, deriveAddress, createOutputScript, fetchUTXOs, estimateFeeRate, selectUTXOs, addInputs, addOutputs
}