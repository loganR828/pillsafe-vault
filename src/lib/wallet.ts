import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'demo-project-id';

// Create a metadata object - this will be used by RainbowKit
export const metadata = {
  name: 'PillSafe Vault',
  description: 'Privacy-preserving prescription management platform',
  url: 'https://pillsafe-vault.vercel.app', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia, mainnet],
  [publicProvider()]
);

// Configure wallets
const { connectors } = getDefaultWallets({
  appName: metadata.name,
  projectId,
  chains,
});

// Add fallback for demo mode
if (projectId === 'demo-project-id') {
  console.warn('Using demo WalletConnect project ID. Please configure NEXT_PUBLIC_PROJECT_ID environment variable for production.');
}

// Create the config
export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

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
