import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
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

  let [names,setnames]= useState(new Map());
  const getName = async (id: number) => {
    if(!id)  return null;
      let res =  await fetchWithAuth(`/api/users/get-user/${id}`, { method: "GET" }, accessToken, updateAccessToken);
      if (res.status === 200) {
        let data = await res.json();
        return data.name;
      } else {
        console.error(`Failed to fetch name for id ${id}: ${res.statusText}`);
        return null;
      }
  };
  
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

    if (matchess.ok)
    {
      let ndata = await matchess.json();
      for(let i = 0; i < ndata.matches.length; i++)
      {
        if (!names.has(ndata.matches[i].P1_Id)) {
          let name = await getName(ndata.matches[i].P1_Id);
          names.set(ndata.matches[i].P1_Id, name);
        }
        if (!names.has(ndata.matches[i].P2_Id)) {
          let name = await getName(ndata.matches[i].P2_Id);
          names.set(ndata.matches[i].P2_Id, name);
        }
        if (!names.has(ndata.matches[i].P3_Id)) {
          let name = await getName(ndata.matches[i].P3_Id);
          names.set(ndata.matches[i].P3_Id, name);
        }
        if (!names.has(ndata.matches[i].P4_Id)) {
          let name = await getName(ndata.matches[i].P4_Id);
          names.set(ndata.matches[i].P4_Id, name);
        }
        ndata.matches[i].Name1 = names.get(ndata.matches[i].P1_Id) || "Unknown";
        ndata.matches[i].Name2 = names.get(ndata.matches[i].P2_Id) || "Unknown";
        ndata.matches[i].Name3 = names.get(ndata.matches[i].P3_Id) || "Unknown";
        ndata.matches[i].Name4 = names.get(ndata.matches[i].P4_Id) || "Unknown";
      }
      setFeatures(ndata.matches || []);
    }
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
            if (feature.gameStatus != 'FINISHED') cardClass += " match-pend";
            else if ((feature.Winner_Id == feature.P1_Id  || feature.Winner_Id == feature.P3_Id) && (feature.P1_Id == id || feature.P3_Id == id ) ) cardClass += " match-win";
            else if ((feature.Winner_Id == feature.P2_Id  || feature.Winner_Id == feature.P4_Id ) && (feature.P2_Id == id || feature.P4_Id == id )) cardClass += " match-win";
            else  cardClass += " match-loss";
            return (
              <Card key={feature.id} className={cardClass}>
                <div className="feature-card-content">
                  <h3 className="feature-title">{feature.score1} - {feature.score2}</h3>
                  <h4 className="feature-title"> {feature.Name1}{feature.mode === 4 ? " & " + feature.Name3 : ""} vs {feature.Name2}{feature.mode === 4 ? " & " + feature.Name4 : ""}</h4>
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