import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Home2 from './pages/Home2';
import Game from './pages/Game';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/friend/:gameId/:invitee" element={<Home2 />} />
      <Route path="/game/:gameId/:playerName/:firstPlayer" element={<Game />} />
    </Routes>
  );
}