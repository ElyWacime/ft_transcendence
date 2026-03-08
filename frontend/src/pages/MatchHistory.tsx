import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Home from "./Home";
import { useAuth } from "@/context/AuthContext";
import { fetchWithAuth } from "@/lib/tokenRefresh";

const MatchHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, accessToken, updateAccessToken } = useAuth();
  const stat = location.state || "";

  const [features, setFeatures] = useState([]);
  let  {id} = stat;
  if(id == "" || id == null || id == undefined)
    id = user?.id;

  const getall = async () => {
    const GAME_SERVICE_URL = import.meta.env.VITE_GAME_SERVICE_URL || `https://${import.meta.env.VITE_DOMAIN}`;
    let matchess =  await fetchWithAuth(`${GAME_SERVICE_URL}/api/game/allmatch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id:id}),
      credentials: "include"
    }, accessToken, updateAccessToken);
    const data = await matchess.json();  
    let res = data.matches;
    setFeatures(res);
  };

useEffect(() => {
  getall();
}, []);

  return (
    <div className="page-container">
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title glow-text">Matches</h2>
          <div className="features-grid1">
          {features.length > 0 ?  (features.map((feature) => {
            let cardClass = "feature-card1"; 
            if ((feature.Winner_Id == feature.P1_Id  || feature.Winner_Id == feature.P3_Id ) && feature.Winner_Id == id) cardClass += " match-win";
            else if ((feature.Winner_Id == feature.P2_Id  || feature.Winner_Id == feature.P4_Id ) && feature.Winner_Id == id) cardClass += " match-win";
            else if (feature.gameStatus == 'FINISHED') cardClass += " match-loss";
            else
              cardClass += " match-pend";
            return (
              <Card key={feature.id} className={cardClass}>
                <div className="feature-card-content">
                  <h3 className="feature-title">{feature.score1} - {feature.score2}</h3>
                  <h4 className="feature-title"> {feature.Name1}{feature.mode === 4 ? " & " + feature.Name3 : ""} vs {feature.Name2}{feature.mode === 4 ? " & " + feature.Name4 : ""}</h4>
                  <p className="feature-description">{feature.CreatedAt}</p>
                </div>
              </Card>
            );
          })):   <h3 className="features-title glow-text">No Matches Yet</h3>
          } 
          </div>

        </div>
      </section>
    </div>
  );
};

export default MatchHistory;