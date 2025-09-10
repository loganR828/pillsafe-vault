# PillSafe Vault

A privacy-preserving prescription management platform built with FHE (Fully Homomorphic Encryption) technology.

## Project Overview

PillSafe Vault is a decentralized prescription management system that uses FHE to encrypt sensitive medical data while maintaining full functionality. Users can store, manage, and verify prescriptions privately without exposing their medical information.

## Features

- **Privacy-Preserving Prescriptions**: All sensitive data is encrypted using FHE
- **Prescription Management**: Create, store, and manage encrypted prescriptions
- **Wallet Integration**: Support for multiple wallet providers (Rainbow, MetaMask, etc.)
- **Secure Vault Operations**: Encrypted storage and retrieval of prescription data
- **Real-time Verification**: Verify prescription authenticity without exposing data
- **Key Management**: Advanced encryption key rotation and management

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn-ui, Tailwind CSS
- **Blockchain**: Solidity, FHE (Fully Homomorphic Encryption)
- **Wallet Integration**: RainbowKit, Wagmi, Viem
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/loganR828/pillsafe-vault.git
cd pillsafe-vault
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Smart Contract Development

### Compile Contracts
```bash
npm run compile
```

### Run Tests
```bash
npm run test
```

### Deploy to Sepolia
```bash
npm run deploy
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Header.tsx      # Application header
│   ├── PrescriptionCard.tsx # Prescription display
│   └── WalletComponent.tsx  # Wallet integration
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
├── contracts/          # Smart contracts
└── scripts/            # Deployment scripts
```

## Security Features

- **FHE Encryption**: All prescription data is encrypted using Fully Homomorphic Encryption
- **Key Rotation**: Regular encryption key rotation for enhanced security
- **Wallet Integration**: Secure wallet connection for blockchain interactions
- **Privacy Preservation**: Zero-knowledge verification of prescription authenticity

## License

MIT License