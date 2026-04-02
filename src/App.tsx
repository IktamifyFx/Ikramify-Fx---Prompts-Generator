import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Layout } from './components/Layout';
import { Generator } from './pages/Generator';
import { History } from './pages/History';
import { Trending } from './pages/Trending';
import { Auth } from './pages/Auth';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster theme="dark" position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Generator />} />
          <Route path="history" element={<History />} />
          <Route path="trending" element={<Trending />} />
          <Route path="auth" element={<Auth />} />
        </Route>
      </Routes>
      <SpeedInsights />
    </BrowserRouter>
  );
}
