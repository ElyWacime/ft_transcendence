.headers on
.mode column

-- SELECT m.id,u1.User_name ,u2.User_name,m.gameStatus,m.score1,m.score2  FROM Match m inner join Users u1 on m.P1_Id = u1.id
-- inner join Users u2 on m.P2_Id = u2.id;

-- SELECT * FROM Match;
-- SELECT * FROM Users;
-- SELECT * FROM Tournament;
-- SELECT * FROM Participate_Tournament;
-- DELETE FROM Tournament;
-- DELETE FROM Participate_Tournament;
-- DELETE FROM Match;

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