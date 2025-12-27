.headers on
.mode column

SELECT m.id,u1.User_name ,u2.User_name,m.gameStatus,m.score1,m.score2,m.T_Id,m.mode  FROM Match m inner join Users u1 on m.P1_Id = u1.id
inner join Users u2 on m.P2_Id = u2.id;
-- docker compose exec -it pong-server bash
-- sqlite3 database.sqlite
SELECT u.User_name,p.T_Id  FROM Participate_Tournament p inner join Users u  on p.P_Id = u.id;
SELECT Winner_Id FROM Match WHERE T_Id = 1 AND round = 1 and  gameStatus = 'FINISHED'

SELECT * FROM Match;
SELECT * FROM Users;
SELECT * FROM Tournament;
SELECT * FROM Participate_Tournament;

DELETE FROM Participate_Tournament;
DELETE FROM Tournament;
DELETE FROM Match;

INSERT INTO Users(id,email, User_name, User_password) VALUES ('1@11.11','1@11.11','1sss','qwertyuiop');
INSERT INTO Users(id,email, User_name, User_password) VALUES ('2@11.11','2@11.11','2qsss','qwertyuiop');
INSERT INTO Users(id,email, User_name, User_password) VALUES ('3@11.11','3@11.11','3qsss','qwertyuiop');
INSERT INTO Users(id,email, User_name, User_password) VALUES ('4@11.11','4@11.11','4qsss','qwertyuiop');
INSERT INTO Users(id,email, User_name, User_password) VALUES ('5@11.11','5@11.11','5qsss','qwertyuiop');
INSERT INTO Users(id,email, User_name, User_password) VALUES ('6@11.11','6@11.11','6qsss','qwertyuiop');
INSERT INTO Users(id,email, User_name, User_password) VALUES ('7@11.11','7@11.11','7qsss','qwertyuiop');
INSERT INTO Users(id,email, User_name, User_password) VALUES ('8@11.11','8@11.11','8qsss','qwertyuiop');
INSERT INTO Users(id,email, User_name, User_password) VALUES ('9@11.11','9@11.11','9qsss','qwertyuiop');
INSERT INTO Users(id,email, User_name, User_password) VALUES ('10@11.11','10@11.11','10qsss','qwertyuiop');
INSERT INTO Users(id,email, User_name, User_password) VALUES ('11@11.11','11@11.11','11qsss','qwertyuiop');
INSERT INTO Users(id,email, User_name, User_password) VALUES ('12@11.11','12@11.11','12qsss','qwertyuiop');

-- SELECT * FROM Users;

-- UPDATE Users  SET  email = '1@1.q'  WHERE id = 1;

INSERT INTO Tournament  DEFAULT VALUES ;
INSERT INTO Tournament  DEFAULT VALUES;

-- INSERT INTO Tournament DEFAULT VALUES;

-- SELECT * FROM Tournament;
-- SELECT * FROM Participate_Tournament;

-- INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES (12, 2);
-- SELECT * FROM Tournament;

-- DELETE FROM Participate_Tournament WHERE P_Id = 12 and T_Id = 2;
-- SELECT * FROM Tournament;

INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES ('1@11.11', 1);
INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES ('2@11.11', 1);
INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES ('3@11.11', 1);
INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES ('4@11.11', 1);
INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES ('5@11.11', 1);
INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES ('6@11.11', 1);
INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES ('7@11.11', 1);
INSERT INTO Participate_Tournament (P_Id, T_Id)  VALUES ('8@11.11', 1);

-- SELECT * FROM Participate_Tournament;
-- SELECT * FROM Tournament;
-- SELECT * FROM Participate_Tournament WHERE P_Id = 1;

INSERT INTO Match (P1_Id, P2_Id, T_Id) VALUES ('1@11.11','2@11.11',1);
INSERT INTO Match (P1_Id, P2_Id, T_Id) VALUES ('3@11.11','4@11.11',1);
INSERT INTO Match (P1_Id, P2_Id, T_Id) VALUES ('5@11.11','6@11.11',1);
INSERT INTO Match (P1_Id, P2_Id, T_Id) VALUES ('7@11.11','8@11.11',1);

-- SELECT * FROM Match;
-- SELECT * FROM Tournament;
-- SELECT * FROM Participate_Tournament;

UPDATE Match SET  score1=5, score2=1,  gameStatus='FINISHED', Winner_Id='1@11.11', count_players = 2
WHERE id = 1;

UPDATE Match SET  score1=4, score2=5,  gameStatus='FINISHED', Winner_Id='4@11.11', count_players = 2
WHERE id = 2;

UPDATE Match SET  score1=5, score2=3,  gameStatus='FINISHED', Winner_Id='5@11.11', count_players = 2
WHERE id = 3;

UPDATE Match SET  score1=0, score2=5,  gameStatus='FINISHED', Winner_Id='8@11.11', count_players = 2
WHERE id = 4;


INSERT INTO Match (P1_Id, P2_Id, T_Id) VALUES ('1@11.11','4@11.11',1);
INSERT INTO Match (P1_Id, P2_Id, T_Id) VALUES ('5@11.11','8@11.11',1);


UPDATE Match SET  score1=5, score2=3,  gameStatus='FINISHED', Winner_Id='1@11.11', count_players = 2
WHERE id = 5;

UPDATE Match SET  score1=5, score2=1,  gameStatus='FINISHED', Winner_Id='8@11.11', count_players = 2
WHERE id = 6;


-- SELECT * FROM Match;
-- SELECT * FROM Tournament;
-- SELECT * FROM Participate_Tournament;

INSERT INTO Match (P1_Id, P2_Id, T_Id) VALUES ('1@11.11','8@11.11',1);

UPDATE Match SET  score1=5, score2=0,  gameStatus='FINISHED', Winner_Id='1@11.11', count_players = 2
WHERE id = 7;

------------------------

INSERT INTO Match(P1_Id) VALUES(10)

INSERT INTO Match (P1_Id) VALUES (?), m.P1_Id;

INSERT INTO Match (P1_Id) VALUES (9);
-- SELECT * FROM Match;


-- Playable Match
-- SELECT * FROM Match   
WHERE mode = 4 and   
count_players <  mode   and 
gameStatus = 'PENDING' and  
P1_Id != 11 and 
(P2_Id != 11 or P2_Id IS NULL) and 
(P3_Id != 11 or P3_Id IS NULL)  and 
(P4_Id != 11 or P4_Id IS NULL) 
LIMIT 1;


-- Last Playable Match (in case of disconnect)
-- SELECT * FROM Match  WHERE (P1_Id = 3 OR P2_Id = 3 OR P3_Id = 3 OR P4_Id = 3) and   ORDER BY CreatedAt DESC LIMIT 1;


UPDATE Match SET  P1_Id=1, P2_Id=2,P3_Id=3, P4_Id=4,  score1=0, score2=0, gameStatus = 'PENDING', Winner_Id = NULL, T_Id = NULL, count_players = 4
WHERE id = 12;

DELETE FROM Match WHERE id = 11;


-----


-----


-- SELECT * FROM Match ;



INSERT INTO Match (P1_Id, P2_Id) VALUES (8,1);

UPDATE Match SET  score1=5, score2=1,  gameStatus='FINISHED', Winner_Id=8, count_players = 2
WHERE id = 8;


SELECT count(*) as Played  FROM  Match 
Where (P1_Id = 8  OR P2_Id = 8  OR P3_Id = 8  OR P4_Id = 8);


SELECT count(*) as Played  FROM  Match 
Where (((P1_Id = 8  OR P3_Id = 8) and score1 >= score2 ) OR ((P2_Id = 8  OR P4_Id = 8)and score2 >= score1))  and gameStatus = 'FINISHED';


