import { WagmiConfig, createClient, configureChains, mainnet, goerli } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import Payment from './Payment'
 
const { chains, provider, webSocketProvider } = configureChains(
  [goerli],
  [publicProvider()],
)
const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})
export default function App() {
  return (
    <WagmiConfig client={client}>
      <Payment />
    </WagmiConfig>
  )
}