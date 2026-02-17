import { useLocation, useNavigate } from "react-router-dom";
import { PongCanvasOnline } from "@/components/PongCanvasOnline";
import { useEffect ,useCallback,useRef,useState} from "react";
// import { useWebSocket } from "../hooks/useWebSocket";
import { toast } from "sonner";
import { useWebSocket } from "@/context/WebSocketContext";
import { decodeJWT } from "@/lib/jwt-utils";
import { ArrowLeft, Trophy ,RotateCcw} from "lucide-react";

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
  const email = localStorage.getItem("email");
  let [flag,setflag] = useState(true);
  const state = location.state as GameOnlineProps;
  if(!state)
      return null;
  const { player1Name, player2Name,player3Name, player4Name, mode } = state;

  const { ws, isReady } = useWebSocket();
  let token = localStorage.getItem("token");
  const decoded = decodeJWT(token);
  const id = decoded.id;
  let [message,setmessage] =  useState();
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.score1  >= 5 ||  data.score2  >= 5) {
        endGame(data.id);
        let x = "";
        if (data.score1  > data.score2 )
        {
          if (data.P1_Id == id || data.P3_Id == id)
            {
              toast.success(`You win the match!`);
              x = `You win the match!`;
            }
          else
            {
              toast.error(`You Lost the match!`);
              x = `You Lost the match!`;
            }
        } 
        else
        {
          if (data.P2_Id == id || data.P4_Id == id)
           {
            toast.success(`You win the match!`);
            x = `You win the match!`;
           }
          else
          {
            toast.error(`You Lost the match!`);
            x = `You Lost the match!`;
          }
        }
        setmessage(x);
        setflag(false);
        // navigate("/");
        // toast.success(`${winner} wins the match!`, {
        //   duration: 2000,
        //   onAutoClose: () => navigate("/"),
        // });
      }
    }
  );

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
  const resetGame = useCallback(() => {
    navigate("/loading?mode=2");
  }, []);
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
        {isReady && flag && (
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
          {!flag && (
              <div className="tournament-match">
              <div className="game-header">
                {/* <button
                  variant="outline"
                  className="back-button"
                >
                  <ArrowLeft className="back-icon" />
                  <span>Back</span>
                </button> */}
                <div style={{ paddingTop: "2rem" }} className="ai-game-title-container">
                  <h1 className="ai-game-title glow-text">
                    🏆 Result 🏆
                  </h1>
                  {/* <p className="ai-game-subtitle">
                    {message} 
                  </p> */}
                              <div className="additional-controls">
              <button onClick={resetGame} className="game-control-button2">
                <RotateCcw className="button-icon" />
                
              </button>
            </div>
                </div>
                <div className="header-spacer"></div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60vh',
                fontSize: '4rem',
                fontWeight: 'bold',
                color: '#3b82f6',
                textShadow: '0 0 30px rgba(59, 130, 246, 0.6)',
                fontFamily: 'monospace'
              }}>
                 {message} 
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameOnline;