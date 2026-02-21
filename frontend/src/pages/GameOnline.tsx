import { useLocation, useNavigate } from "react-router-dom";
import { PongCanvasOnline } from "@/components/PongCanvasOnline";
import { useEffect ,useCallback} from "react";
import { toast } from "sonner";
import { useWebSocket } from "@/context/WebSocketContext";
import { decodeJWT } from "@/lib/jwt-utils";
import Home from "./Home";

interface GameOnlineProps {
  player1Name: string;
  player2Name: string;
  player3Name: string;
  player4Name: string;
  mode: number;
}

const GameOnline = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as GameOnlineProps;
  if(!state)
  {
      useEffect(()=>{
          navigate("/");
      },[]);
      return <Home></Home>;
  }
  
  const { player1Name, player2Name,player3Name, player4Name, mode } = state;

  const { ws, isReady } = useWebSocket();
  let token = localStorage.getItem("token");
  let id = null;
  if (token)
  {
   try {
    const decoded = decodeJWT(token);
    id = decoded.id;
   } catch (e) {
      console.log("ERROR :: ",e);
   }
  }

  const endGame = useCallback((id) => {
    if (ws && isReady && ws.readyState == WebSocket.OPEN)
      ws.send(JSON.stringify({
        token:localStorage.getItem("token"),
        type: "FINISHED",
        mode: mode,
        matchId:id
      }));
    }
  );

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.score1  >= 5 ||  data.score2  >= 5) {
        
        let x = "";
        if (data.score1  > data.score2 )
        {
          if (data.P1_Id == id || data.P3_Id == id)
              x = `You win the match!`;
          else
              x = `You Lost the match!`;
        } 
        else
        {
          if (data.P2_Id == id || data.P4_Id == id)
            x = `You win the match!`;
          else
            x = `You Lost the match!`;
        }
        endGame(data.id);
        navigate("/result", {state: { message: x}});
      }
    }
  );

  useEffect(() => {
    if (!(ws && isReady && ws.readyState == WebSocket.OPEN)) return;

    ws.addEventListener("message", handleMessage);
    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [ws]);

  return (
    <div className="ai-game-page">
      <div className="ai-game-container">
        <div className="ai-game-header">
          <div className="ai-game-title-container">
            <h1 className="ai-game-title glow-text">
              <span>PLAYER VS Player</span>
            </h1>
            <p className="ai-game-subtitle">
            Challenge Other Players.
            </p>
          </div>
        </div>
  
        <div className="ai-game-canvas-container">
        {isReady  && (
            <PongCanvasOnline
              player1Name={player1Name}
              player2Name={player2Name}
              player3Name={player3Name}
              player4Name={player4Name}
              ws={ws}
              mode={mode}
              isReady={isReady}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GameOnline;