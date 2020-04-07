export default () => {
  const r = require.context('./img/paper/', true, /\.png$/)
  const importAll = (r) => r.keys().map(file => file.match(/([^\/]+)\/[^\/]+$/)[1])
  const uniqueWallets = [...new Set(importAll(r))];
  // List of all available wallets.
  return uniqueWallets
}
