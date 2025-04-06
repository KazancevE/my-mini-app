import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ConfigProvider } from 'antd';
import ru from 'antd/locale/ru_RU'
const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ConfigProvider locale={ru}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);