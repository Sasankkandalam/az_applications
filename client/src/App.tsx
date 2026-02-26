import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import App1SkepticalOncologist from './apps/App1SkepticalOncologist';
import App2TriviaChallenge from './apps/App2TriviaChallenge';
import App3SalesStrategy from './apps/App3SalesStrategy';
import App4CustomerInsight from './apps/App4CustomerInsight';
import App5ContentCreator from './apps/App5ContentCreator';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app1" element={<App1SkepticalOncologist />} />
        <Route path="/app2" element={<App2TriviaChallenge />} />
        <Route path="/app3" element={<App3SalesStrategy />} />
        <Route path="/app4" element={<App4CustomerInsight />} />
        <Route path="/app5" element={<App5ContentCreator />} />
      </Routes>
    </BrowserRouter>
  );
}
