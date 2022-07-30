import '../styles/globals.css'
import Provider from '../store/Web3Provider'

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  )
}
export default MyApp
