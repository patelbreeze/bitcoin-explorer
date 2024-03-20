import React, { useState } from "react";
import axios from "axios";
import "./TransactionHistory.css";

interface Transaction {
  apiVersion: string;
  requestId: string;
  data: {
    item: {
      transactionId: string;
      index: number;
      isConfirmed: boolean;
      minedInBlockHash: string;
      minedInBlockHeight: number;
      recipients: {
        address: string;
        amount: string;
      }[];
      senders: {
        address: string;
        amount: string;
      }[];
      timestamp: number;
      transactionHash: string;
      blockchainSpecific: {
        locktime: number;
        size: number;
        vSize: number;
        version: number;
        vin: {
          addresses: string[];
          scriptSig: {
            asm: string;
            hex: string;
            type: string;
          };
          sequence: number;
          txid: string;
          txinwitness: string[];
          value: string;
          vout: number;
        }[];
        vout: {
          isSpent: boolean;
          scriptPubKey: {
            addresses: string[];
            asm: string;
            hex: string;
            reqSigs: number;
            type: string;
          };
          value: string;
        }[];
        confirmations?: number; // Make confirmations optional
      };
      fee: {
        amount: string;
        unit: string;
      };
      totalInput: string; // New field
      totalOutput: string; // New field
      feePerByte?: string; // Make feePerByte optional
      valueWhenTransacted?: string; // Make valueWhenTransacted optional
    };
  };
}

const timestampToDate = (timestamp: number | undefined) => {
  if (!timestamp) {
    return ""; // Or any default value you prefer
  }

  const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
};

const TransactionDetails: React.FC = () => {
  const [transactionId, setTransactionId] = useState("");
  const [transactionData, setTransactionData] = useState<Transaction | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get<Transaction>(
        `http://localhost:5000/api/transaction/${transactionId}`
      );
      setTransactionData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
      setError("Error fetching transaction data");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="transaction-container">
        <form
          className="container transaction-form"
          onSubmit={handleFormSubmit}
        >
          <input
            className="transaction-input"
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter Transaction ID"
          />
          <button className="transaction-button" type="submit">
            Fetch Transaction Data
          </button>
        </form>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {transactionData && (
        <div className="transaction-container">
          <h2>Transaction Details</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="transaction-container">
              <div className="transaction-details">
                <div className="transaction-info">
                  <div className="info-row">
                    <span className="info-label">Transaction ID: </span>
                    <span className="info-value">
                      {transactionData?.data.item.transactionId}
                    </span>
                  </div>
                  <hr />

                  <div className="info-row">
                    <span className="info-label">Sender: </span>
                    <span className="info-value">
                      {transactionData?.data.item.senders[0].address}
                    </span>
                  </div>
                  <hr />

                  <div className="info-row">
                    <span className="info-label">Recipient: </span>
                    <span className="info-value">
                      {transactionData?.data.item.recipients[0].address}
                    </span>
                  </div>
                  <hr />

                  <div className="info-row">
                    <span className="info-label">Amount: </span>
                    <span className="info-value">
                      {transactionData?.data.item.recipients[0].amount}
                    </span>
                  </div>
                  <hr />

                  <div className="info-row">
                    <span className="info-label">Transaction Hash: </span>
                    <span className="info-value">
                      {transactionData?.data.item.transactionHash}
                    </span>
                  </div>
                  <hr />
                  <hr />
                  <hr />
                  <hr />

                  <div className="info-row">
                    <span className="info-label">Included in block:</span>
                    <span className="info-value">
                      {transactionData?.data.item.minedInBlockHeight}
                    </span>
                  </div>
                  <hr />

                  <div className="info-row">
                    <span className="info-label">Fee: </span>
                    <span className="info-value">
                      {transactionData?.data.item.fee.amount} BTC
                    </span>
                  </div>
                  <hr />

                  <div className="info-row">
                    <span className="info-label">Confirmations: </span>
                    <span className="info-value">
                      {
                        transactionData?.data.item.blockchainSpecific
                          .confirmations
                      }{" "}
                      Confirmed
                    </span>
                  </div>
                  <hr />

                  <div className="info-row">
                    <span className="info-label">Size: </span>
                    <span className="info-value">
                      {transactionData?.data.item.blockchainSpecific.size} bytes
                    </span>
                  </div>
                  <hr />

                  <div className="info-row">
                    <span className="info-label">Date/Time: </span>
                    <span className="info-value">
                      {timestampToDate(transactionData?.data.item.timestamp)}
                    </span>
                  </div>
                  <hr />
                </div>
              </div>

              <div className="transaction-container">
                <div className="transaction-table-container">
                  <h3>Details</h3>
                  <table className="transaction-table">
                    <tbody>
                      <tr>
                        <td>Status</td>
                        <td>
                          {transactionData?.data.item.isConfirmed
                            ? "Confirmed"
                            : "Unconfirmed"}
                        </td>
                      </tr>
                      <tr>
                        <td>Size in Bytes</td>
                        <td>
                          {transactionData?.data.item.blockchainSpecific.size}
                        </td>
                      </tr>
                      <tr>
                        <td>Date/Time</td>
                        <td>
                          {timestampToDate(
                            transactionData?.data.item.timestamp
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Included in block</td>
                        <td>{transactionData?.data.item.minedInBlockHeight}</td>
                      </tr>
                      <tr>
                        <td>Confirmations</td>
                        <td>
                          {
                            transactionData?.data.item.blockchainSpecific
                              .confirmations
                          }
                          Confirmed
                        </td>
                      </tr>
                      <tr>
                        <td>Total Input</td>
                        <td>
                          {transactionData?.data.item.recipients.reduce(
                            (total, recipient) =>
                              total + parseFloat(recipient.amount),
                            0
                          )}{" "}
                          BTC
                        </td>
                      </tr>
                      <tr>
                        <td>Total Output</td>
                        <td>
                          {transactionData?.data.item.senders.reduce(
                            (total, sender) =>
                              total + parseFloat(sender.amount),
                            0
                          )}{" "}
                          BTC
                        </td>
                      </tr>
                      <tr>
                        <td>Fees</td>
                        <td>{transactionData?.data.item.fee.amount} BTC</td>
                      </tr>
                      <tr>
                        <td>Fee per byte</td>
                        <td>
                          {transactionData
                            ? (
                                parseFloat(
                                  transactionData.data.item.fee.amount
                                ) /
                                transactionData.data.item.blockchainSpecific
                                  .size
                              ).toFixed(20)
                            : "N/A"}{" "}
                          BTC
                        </td>
                      </tr>
                      <tr>
                        <td>Value when transacted</td>
                        <td>
                          {transactionData?.data.item.recipients.reduce(
                            (total, recipient) =>
                              total + parseFloat(recipient.amount),
                            0
                          )}{" "}
                          BTC
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* detail table over */}
              {/* #########################################################################################33 */}
              {/* Input table */}

              <div className="transaction-container">
                <div className="transaction-table-container">
                  <h3>Inputs</h3>
                  <table className="transaction-table">
                    <thead>
                      <tr>
                        <td>Index</td>

                        <td>Address</td>
                        <td>Sigscript ASM</td>
                        <td>Sigscript HEX</td>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionData &&
                        transactionData.data.item.blockchainSpecific.vin.map(
                          (input, index) => (
                            <tr key={index}>
                              <td>{index}</td>
                              <td>{input.addresses.join(", ")}</td>
                              <td>{input.scriptSig?.asm || "N/A"}</td>
                              <td>{input.scriptSig?.hex || "N/A"}</td>
                            </tr>
                          )
                        )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Output table */}
              {/* #########################################################################################33 */}
              <div className="transaction-container">
                <div className="transaction-table-container">
                  <h3>Outputs</h3>
                  <table className="transaction-table">
                    <thead>
                      <tr>
                        <th>Index</th>
                        <th>Address</th>
                        <th>Sigscript ASM</th>
                        <th>Sigscript HEX</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionData &&
                        transactionData.data.item.blockchainSpecific.vout.map(
                          (output, index) => (
                            <tr key={index}>
                              <td>{index}</td>
                              <td>
                                {output.scriptPubKey.addresses.join(", ")}
                              </td>
                              <td>{output.scriptPubKey.asm || "N/A"}</td>
                              <td>{output.scriptPubKey.hex || "N/A"}</td>
                            </tr>
                          )
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionDetails;
