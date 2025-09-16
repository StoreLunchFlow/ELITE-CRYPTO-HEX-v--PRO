export class TransactionBroadcaster {
    private endpoints = [
        'https://mempool.space/api/tx',
        'https://blockstream.info/api/tx',
        'https://api.blockcypher.com/v1/btc/main/txs/push'
    ];

    async broadcast(txHex: string): Promise<string> {
        const results = await Promise.allSettled(
            this.endpoints.map(endpoint => this.postToEndpoint(endpoint, txHex))
        );

        for (const result of results) {
            if (result.status === 'fulfilled' && result.value) {
                return result.value;
            }
        }

        throw new Error("All broadcast endpoints failed");
    }

    private async postToEndpoint(endpoint: string, txHex: string): Promise<string | null> {
        try {
            const res = await axios.post(endpoint, txHex, {
                headers: { 'Content-Type': 'text/plain' }
            });
            return typeof res.data === 'string' ? res.data : res.data.txid;
        } catch {
            return null;
        }
    }
}