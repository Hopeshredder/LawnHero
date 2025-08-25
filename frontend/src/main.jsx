import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={App} />
);
