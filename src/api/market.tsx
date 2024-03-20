import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/transaction/:transactionId', async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const apiKey = '6ce40de53ed5fb01aabb4183767a1068907e4533';
    const url = `https://rest.cryptoapis.io/v2/blockchain-data/bitcoin/testnet/transactions/${transactionId}`;

    const instance = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      }
    });

    const transactionData = instance.data;
    res.json(transactionData);
  } catch (error) {
    console.error('Error fetching transaction data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// export default instance;
