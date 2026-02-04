
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './css/index.css'
import './css/home.css'
import './css/navbar.css'
import './css/matchmacking.css'
import './css/gameCanvas.css'
import './css/pongCanvas.css'
import './css/aiGame.css'
import './css/login.css'
import './css/register.css'
import './css/LocalTournament.css'

createRoot(document.getElementById("root")!).render(<App />);
