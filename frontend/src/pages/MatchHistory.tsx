import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Home from "./Home";
import { decodeJWT } from "@/lib/jwt-utils";

const MatchHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stat = location.state;

  const [features, setFeatures] = useState([]);
  let  id = "cmlu028wl0000vy36ja1gbxf7";
  let token = localStorage.getItem("token");

  if (token)
  {
    const decoded = decodeJWT(token);
    id = decoded.id;
  }

  const getall = async () => {
    console.log(id);
    let matchess =  await fetch(`http://${import.meta.env.VITE_DOMAIN}:3000/allmatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: localStorage.getItem("token") ,id:id}),
      credentials: "include"
    });
    const data = await matchess.json();  
    let res = data.matches;
    console.log(res);
    console.log(id);
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
          {features.map((feature) => {
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
          })}
          </div>

        </div>
      </section>
    </div>
  );
};

export default MatchHistory;