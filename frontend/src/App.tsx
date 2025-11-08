import { Routes, Route } from 'react-router-dom';
import Ranking from './pages/Ranking';
import Player from './pages/Player';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Ranking />} />
      <Route path="/player/:login" element={<Player />} />
    </Routes>
  );
}

export default App;

