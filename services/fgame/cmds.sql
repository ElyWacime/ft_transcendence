.headers ON
.mode column

SELECT * FROM Match;
SELECT * FROM Users;
SELECT * FROM Tournament;
SELECT * FROM Participate_Tournament;

INSERT INTO Users(email, User_name, User_password) VALUES ('1s@s.s','1sss','sss');
INSERT INTO Users(email, User_name, User_password) VALUES ('2qs@s.s','2qsss','qsss');
INSERT INTO Users(email, User_name, User_password) VALUES ('3qs@s.s','3qsss','qsss');
INSERT INTO Users(email, User_name, User_password) VALUES ('4qs@s.s','4qsss','qsss');
INSERT INTO Users(email, User_name, User_password) VALUES ('5qs@s.s','5qsss','qsss');
INSERT INTO Users(email, User_name, User_password) VALUES ('6qs@s.s','6qsss','qsss');
INSERT INTO Users(email, User_name, User_password) VALUES ('7qs@s.s','7qsss','qsss');
INSERT INTO Users(email, User_name, User_password) VALUES ('8qs@s.s','8qsss','qsss');
INSERT INTO Users(email, User_name, User_password) VALUES ('9qs@s.s','9qsss','qsss');
INSERT INTO Users(email, User_name, User_password) VALUES ('10qs@s.s','10qsss','qsss');
INSERT INTO Users(email, User_name, User_password) VALUES ('11qs@s.s','11qsss','qsss');
INSERT INTO Users(email, User_name, User_password) VALUES ('12qs@s.s','12qsss','qsss');

SELECT * FROM Users;

UPDATE Users  SET  email = '1@1.q'  WHERE id = 1;

INSERT INTO Tournament DEFAULT VALUES;

INSERT INTO Tournament DEFAULT VALUES;

SELECT * FROM Tournament;
SELECT * FROM Participate_Tournament;

INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES (12, 2);
SELECT * FROM Tournament;

DELETE FROM Participate_Tournament WHERE P_Id = 12 and T_Id = 2;
SELECT * FROM Tournament;

INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES (1, 1);
INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES (2, 1);
INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES (3, 1);
INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES (4, 1);
INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES (5, 1);
INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES (6, 1);
INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES (7, 1);
INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES (8, 1);

SELECT * FROM Participate_Tournament;
SELECT * FROM Tournament;
SELECT * FROM Participate_Tournament WHERE P_Id = 1;

INSERT INTO Match (P1_Id, P2_Id, T_Id) VALUES (1,2,1);
INSERT INTO Match (P1_Id, P2_Id, T_Id) VALUES (3,4,1);
INSERT INTO Match (P1_Id, P2_Id, T_Id) VALUES (5,6,1);
INSERT INTO Match (P1_Id, P2_Id, T_Id) VALUES (7,8,1);

SELECT * FROM Match;
SELECT * FROM Tournament;
SELECT * FROM Participate_Tournament;

UPDATE Match SET  score1=5, score2=1,  gameStatus='FINISHED', Winner_Id=1, count_players = 2,result = 'WIN'
WHERE id = 1;

UPDATE Match SET  score1=4, score2=5,  gameStatus='FINISHED', Winner_Id=4, count_players = 2,result = 'WIN'
WHERE id = 2;

UPDATE Match SET  score1=5, score2=3,  gameStatus='FINISHED', Winner_Id=5, count_players = 2,result = 'WIN'
WHERE id = 3;

UPDATE Match SET  score1=0, score2=5,  gameStatus='FINISHED', Winner_Id=8, count_players = 2,result = 'WIN'
WHERE id = 4;


INSERT INTO Match (P1_Id, P2_Id, T_Id) VALUES (1,4,1);
INSERT INTO Match (P1_Id, P2_Id, T_Id) VALUES (5,8,1);


UPDATE Match SET  score1=5, score2=3,  gameStatus='FINISHED', Winner_Id=1, count_players = 2,result = 'WIN'
WHERE id = 5;

UPDATE Match SET  score1=5, score2=1,  gameStatus='FINISHED', Winner_Id=8, count_players = 2,result = 'WIN'
WHERE id = 6;


SELECT * FROM Match;
SELECT * FROM Tournament;
SELECT * FROM Participate_Tournament;

INSERT INTO Match (P1_Id, P2_Id, T_Id) VALUES (1,8,1);

UPDATE Match SET  score1=5, score2=0,  gameStatus='FINISHED', Winner_Id=1, count_players = 2,result = 'WIN'
WHERE id = 7;

------------------------

INSERT INTO Match(P1_Id) VALUES(10)

INSERT INTO Match (P1_Id) VALUES (?), m.P1_Id;

INSERT INTO Match (P1_Id) VALUES (9);
SELECT * FROM Match;


-- Playable Match
SELECT * FROM Match   
WHERE mode = 4 and   
count_players <  mode   and 
gameStatus = 'PENDING' and  
P1_Id != 11 and 
(P2_Id != 11 or P2_Id IS NULL) and 
(P3_Id != 11 or P3_Id IS NULL)  and 
(P4_Id != 11 or P4_Id IS NULL) 
LIMIT 1;


-- Last Playable Match (in case of disconnect)
SELECT * FROM Match  WHERE (P1_Id = 3 OR P2_Id = 3 OR P3_Id = 3 OR P4_Id = 3) and  result = 'PENDING'  ORDER BY CreatedAt DESC LIMIT 1;


UPDATE Match SET  P1_Id=1, P2_Id=2,P3_Id=3, P4_Id=4,  score1=0, score2=0, gameStatus = 'PENDING', Winner_Id = NULL, T_Id = NULL, count_players = 4,result = 'PENDING'
WHERE id = 12;

DELETE FROM Match WHERE id = 11;


-----
