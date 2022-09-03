import './App.css';
import Entry from './entry/Entry';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PokerRoom from './room/PokerRoom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Entry/>} />
        <Route path = "room/*" element={<PokerRoom/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
