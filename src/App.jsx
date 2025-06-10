import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Home2 from './pages/Home2';
import Game from './pages/Game';
import toast, {Toaster} from 'react-hot-toast';

export default function App() {
  return (
    <div>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/friend/:gameId/:invitee" element={<Home2 />} />
      <Route path="/game/:gameId/:playerName/:firstPlayer" element={<Game />} />
    </Routes>
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 2000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }} />
    </div>
  );
}