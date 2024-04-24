import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <PayPalScriptProvider>
        <App />
      </PayPalScriptProvider>
    </BrowserRouter>
  </Provider>
)
