# Expense Splitter - A Blockchain-Based Expense Sharing Platform

This project is a decentralized expense splitting application built on the Ethereum blockchain. It allows users to create groups, add expenses, and track balances in a transparent and secure manner.

## Project Overview

Key features include:

*   **Group Management:** Create and manage groups with friends, family, or colleagues.
*   **Expense Tracking:** Add and split expenses within groups.
*   **Balance Calculation:** Automatically calculate individual balances within each group.
*   **Secure Transactions:** Leverage blockchain technology for secure and transparent transactions.
*   **File Storage:** Utilizes decentralized storage on Filecoin via Synapse SDK for receipts and other expense-related files.

## Technologies Used

*   **Solidity:** Smart contracts for core logic ([contracts/expense.sol](contracts/expense.sol))
*   **Hardhat:** Development environment and testing framework ([hardhat.config.ts](hardhat.config.ts))
*   **Ethers.js:** Library for interacting with the Ethereum blockchain
*   **React:** Frontend user interface ([web/src](web/src))
*   **Next.js:** React framework for building server-rendered applications ([web/next.config.js](web/next.config.js))
*   **Tailwind CSS:** CSS framework for styling ([web/tailwind.config.js](web/tailwind.config.js), [web/src/app/globals.css](web/src/app/globals.css))
*   **ConnectKit:** Wallet connection library ([web/src/app/wagmi.config.ts](web/src/app/wagmi.config.ts))
*   **Wagmi:** React hooks for Ethereum ([web/src/app/wagmi.config.ts](web/src/app/wagmi.config.ts))
*   **Synapse SDK:** For interacting with Filecoin decentralized storage ([web/src/lib/synapse-service.ts](web/src/lib/synapse-service.ts), [web/src/hooks/useSimpleUpload.ts](web/src/hooks/useSimpleUpload.ts))
*   **The Graph:**  For indexing and querying blockchain data ([es/src/expense-contract.ts](es/src/expense-contract.ts), [es/subgraph.yaml](es/subgraph.yaml))

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd expense-splitter
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set environment variables:**

    *   Create a `.env` file in the root directory.
    *   Add the following variables, replacing the placeholders with your actual values:

        ```
        NEXT_PUBLIC_PRIVATE_KEY=<your_ethereum_private_key>
        SEPOLIA_RPC_URL=<your_sepolia_rpc_url>
        ```

    *   You can find an example `.env` file in [.env.example](.env.example).

4.  **Configure Hardhat:**

    *   Ensure the `hardhat.config.ts` file is properly configured with your network settings and private key.

## Smart Contract Deployment

1.  **Deploy the smart contract:**

    ```bash
    npx hardhat deploy --network sepolia
    ```

    *   This will deploy the `ExpenseContract` to the Sepolia test network.
    *   Make sure you have Sepolia ETH in your wallet to pay for gas fees.

## Running Tests

### Solidity Tests

```bash
npx hardhat test