import { Provider } from "react-redux";
import { store } from "./hooks/store.js"; // Importe a store Redux
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
