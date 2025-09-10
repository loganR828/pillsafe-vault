import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'demo-project-id';

// Create the config using RainbowKit's simplified configuration
export const config = getDefaultConfig({
  appName: 'PillSafe Vault',
  projectId,
  chains: [sepolia, mainnet],
  ssr: false, // Disable server-side rendering for better compatibility
});

// Alternative wallet configurations for diversity
export const walletConfigs = {
  rainbow: {
    name: 'Rainbow',
    icon: '🌈',
    description: 'The fun, colorful way to interact with Web3'
  },
  metaMask: {
    name: 'MetaMask',
    icon: '🦊',
    description: 'The most popular Web3 wallet'
  },
  coinbase: {
    name: 'Coinbase Wallet',
    icon: '🔵',
    description: 'Secure and easy-to-use wallet'
  },
  walletConnect: {
    name: 'WalletConnect',
    icon: '🔗',
    description: 'Connect to 300+ wallets'
  },
  trust: {
    name: 'Trust Wallet',
    icon: '🛡️',
    description: 'The most trusted & secure crypto wallet'
  }
};

// Network configurations
export const networks = {
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    blockExplorer: 'https://sepolia.etherscan.io'
  },
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    blockExplorer: 'https://etherscan.io'
  }
} as const;

// Add fallback for demo mode
if (projectId === 'demo-project-id') {
  console.warn('Using demo WalletConnect project ID. Please configure NEXT_PUBLIC_PROJECT_ID environment variable for production.');
}

// Contract addresses (update these after deployment)
export const CONTRACT_ADDRESSES = {
  sepolia: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA || '0x0000000000000000000000000000000000000000',
  mainnet: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET || '0x0000000000000000000000000000000000000000',
};

// ABI for the PillSafe Vault contract
export const PILLSAFE_VAULT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_verifier",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "prescriptionId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "patient",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "doctor",
        "type": "address"
      }
    ],
    "name": "PrescriptionCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "prescriptionId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      }
    ],
    "name": "PrescriptionVerified",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_patientId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_doctorId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_medicationId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_medicationName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_instructions",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_expiresAt",
        "type": "uint256"
      }
    ],
    "name": "createPrescription",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "prescriptionId",
        "type": "uint256"
      }
    ],
    "name": "getPrescriptionInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "medicationName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "instructions",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "dosage",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "frequency",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "duration",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "patient",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "doctor",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "expiresAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "prescriptionId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      }
    ],
    "name": "verifyPrescription",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
