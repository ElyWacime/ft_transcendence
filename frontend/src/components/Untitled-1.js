  //       <div className="max-w-6xl mx-auto">
  //         {wsReady && (
  //           <PongCanvasOnline
  //             player1Name={player1.alias}
  //             player2Name={player2.alias}
  //             onGameEnd={handleGameEnd}
  //             maxScore={5}
  //             ws={wsRef.current!}
  //           />
  //         )}
  //       </div>



  //       useEffect(() => {
  //         if (wsRef.current == null) {
  //           console.log("WebSocket is created");
  //           wsRef.current = new WebSocket("ws://10.30.238.84:3000/ws");
  //         }
      
  //         wsRef.current.onopen = () => {
  //           console.log("Connected to WebSocket server");
  //           setWsReady(true);
  //         };
      
  //         wsRef.current.onclose = () => {
  //           setWsReady(false);
  //           wsRef.current = null;
  //           console.log("Disconnected ... ");
  //         };
      
  //         return () => wsRef.current?.close();
  //       }, []);



  // // new 
  // function draw() {
  //   const state = gameStateRef.current;
  //   if (!state) return;

  //   const canvas = canvasRef.current;
  //   const ctx = canvas?.getContext("2d");
  //   if (!canvas || !ctx) return;

  //   // Clear canvas
  //   ctx.fillStyle = "hsl(222 47% 4%)";
  //   ctx.fillRect(0, 0, canvas.width, canvas.height);

  //   // Center line
  //   ctx.strokeStyle = "hsl(222 47% 12%)";
  //   ctx.lineWidth = 2;
  //   ctx.setLineDash([10, 10]);
  //   ctx.beginPath();
  //   ctx.moveTo(canvas.width / 2, 0);
  //   ctx.lineTo(canvas.width / 2, canvas.height);
  //   ctx.stroke();
  //   ctx.setLineDash([]);

  //   // Paddles
  //   ctx.fillStyle = "hsl(217 91% 60%)";
  //   ctx.fillRect(state.paddle1.x, state.paddle1.y, state.paddle1.width, state.paddle1.height);
  //   ctx.fillRect(state.paddle2.x, state.paddle2.y, state.paddle2.width, state.paddle2.height);

  //   if (state.Mode === 4) {
  //     ctx.fillRect(state.paddle3.x, state.paddle3.y, state.paddle3.width, state.paddle3.height);
  //     ctx.fillRect(state.paddle4.x, state.paddle4.y, state.paddle4.width, state.paddle4.height);
  //   }

  //   // Ball
  //   ctx.beginPath();
  //   ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
  //   ctx.fillStyle = "hsl(217 91% 60%)";
  //   ctx.fill();

  //   // Glow effect
  //   ctx.shadowColor = "hsl(217 91% 60%)";
  //   ctx.shadowBlur = 20;
  //   ctx.fill();
  //   ctx.shadowBlur = 0;

  //   // Scores
  //   ctx.fillStyle = "hsl(210 40% 98%)";
  //   ctx.font = '48px "JetBrains Mono", monospace';
  //   ctx.textAlign = "center";
  //   ctx.fillText(state.score.player1.toString(), canvas.width / 4, 60);
  //   ctx.fillText(state.score.player2.toString(), (canvas.width * 3) / 4, 60);
  // }

  // useEffect(() => {
  //   gameStateRef.current = gameState;
  // }, [gameState]);

  // useEffect(() => {
  //   function loop() {
  //     draw();
  //     requestAnimationFrame(loop);
  //   }
  //   requestAnimationFrame(loop);
  // }, []);


  // useEffect(() => {
  //   if (!ws) return;     // wait for ws to be initialized

  //   ws.onmessage = (event) => {
  //     let data = JSON.parse(event.data);
  //     console.log("server says:", data);
  //     const p1 = data.player1Name;
  //     const p2 = data.player2Name;
  //     let opponent;
  //     if (email === p1)
  //       opponent = p2;
  //     else
  //       opponent = p1;
  //     setGameState(prev => ({
  //       ...prev,
  //       player2Name: opponent,  // or better: opponentName
  //     }));
  //   };

  //   ws.onclose = () => {
  //     console.log("Disconnected from server");
  //   };
  //   return () => {
  //     // Optionally remove listeners if you want to avoid leaks
  //     ws.onmessage = null;
  //     ws.onclose = null;
  //   };
  //   // return () => ws.close();
  // }, [ws]);

  // const startGame = () => {
  //   const canvas = canvasRef.current;
  //   if (canvas) {
  //     canvas.tabIndex = 0;
  //     canvas.focus({ preventScroll: true });
  //     canvas.scrollIntoView({ behavior: "smooth", block: "center" });
  //   }
  //   // if (!ws || ws.readyState !== ws.OPEN) return;
  //   // else

  //   ws.send(JSON.stringify({
  //     type: "register",
  //     email: email
  //   }));
  //   // setGameState(prev => {
  //   //   const next = { ...prev, gameStatus: "playing" };
  //   //   gameStateRef.current = next;
  //   //   return next;
  //   // });

  // };



