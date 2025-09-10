import { walletConfigs } from '@/lib/wallet';

export const WalletInfo = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Supported Wallets</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {walletConfigs ? Object.entries(walletConfigs).map(([key, wallet]) => (
          <div key={key} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <span className="text-2xl">{wallet.icon}</span>
            <div>
              <h4 className="font-medium text-gray-900">{wallet.name}</h4>
              <p className="text-sm text-gray-600">{wallet.description}</p>
            </div>
          </div>
        )) : null}
      </div>
    </div>
  );
};
