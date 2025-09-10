# Vercel Deployment Guide for PillSafe Vault

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub (already done)
3. **Environment Variables**: Prepare the required environment variables

## Step-by-Step Deployment Instructions

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project" or "Import Project"
3. Select "Import Git Repository"
4. Choose "GitHub" as your Git provider
5. Find and select `loganR828/pillsafe-vault` repository
6. Click "Import"

### Step 2: Configure Project Settings

1. **Project Name**: `pillsafe-vault` (or your preferred name)
2. **Framework Preset**: Select "Vite"
3. **Root Directory**: Leave as default (`.`)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

### Step 3: Environment Variables Configuration

Click "Environment Variables" and add the following:

```
# Network Configuration
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET=0x0000000000000000000000000000000000000000

**重要**: 如果不设置 `NEXT_PUBLIC_PROJECT_ID`，应用将使用演示模式，钱包连接功能可能受限。

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

**Important Notes:**
- Replace `your_walletconnect_project_id` with your actual WalletConnect Project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com)
- Update contract addresses after deploying your smart contracts
- All environment variables starting with `NEXT_PUBLIC_` will be available in the browser

### Step 4: Build Configuration

1. **Node.js Version**: Select "18.x" or "20.x"
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Install Command**: `npm install --legacy-peer-deps`

**Important**: The `--legacy-peer-deps` flag is required to resolve dependency conflicts between RainbowKit and Viem versions.

### Step 5: Domain Configuration (Optional)

1. Go to "Domains" tab
2. Add your custom domain if you have one
3. Configure DNS settings as instructed by Vercel

### Step 6: Deploy

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-5 minutes)
3. Your app will be available at the provided Vercel URL

### Step 7: Post-Deployment Configuration

1. **Update Contract Addresses**: After deploying smart contracts, update the environment variables
2. **Test Wallet Connection**: Verify that wallet connection works properly
3. **Test Responsive Design**: Check the app on different screen sizes

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_PROJECT_ID` | WalletConnect Project ID | `abc123def456` |
| `NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA` | Smart contract address on Sepolia | `0x1234...` |
| `NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET` | Smart contract address on Mainnet | `0x5678...` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` | Vercel Analytics ID | `prj_abc123` |

## Troubleshooting

### Common Issues

1. **Build Fails with Dependency Errors**
   - **Error**: `ERESOLVE unable to resolve dependency tree` with RainbowKit and Viem
   - **Solution**: Use `npm install --legacy-peer-deps` in install command
   - **Alternative**: The project has been configured with compatible versions (wagmi v1, viem v1.19.9)

2. **Wallet Connection Not Working**
   - Check if `NEXT_PUBLIC_PROJECT_ID` is correctly set
   - Verify WalletConnect project is properly configured

3. **Contract Calls Failing**
   - Ensure contract addresses are correct
   - Check if contracts are deployed on the correct network

4. **Styling Issues**
   - Verify Tailwind CSS is properly configured
   - Check if all UI components are imported correctly

### Build Logs

If deployment fails, check the build logs in Vercel dashboard:
1. Go to your project dashboard
2. Click on the failed deployment
3. Check "Build Logs" tab for error details

## Performance Optimization

1. **Enable Vercel Analytics**: Add analytics to monitor performance
2. **Configure Caching**: Set up proper caching headers
3. **Optimize Images**: Use Vercel's image optimization
4. **Enable Edge Functions**: For better global performance

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to repository
2. **API Keys**: Use Vercel's environment variables for all API keys
3. **CORS**: Configure CORS properly for production
4. **HTTPS**: Vercel automatically provides HTTPS

## Monitoring and Maintenance

1. **Set up monitoring**: Use Vercel Analytics or external tools
2. **Regular updates**: Keep dependencies updated
3. **Performance monitoring**: Monitor Core Web Vitals
4. **Error tracking**: Set up error tracking (e.g., Sentry)

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vite Documentation**: [vitejs.dev](https://vitejs.dev)
- **Wagmi Documentation**: [wagmi.sh](https://wagmi.sh)
- **RainbowKit Documentation**: [rainbowkit.com](https://rainbowkit.com)

## Deployment URL

After successful deployment, your app will be available at:
`https://pillsafe-vault-[random-string].vercel.app`

You can also set up a custom domain for a more professional URL.
