CREATE TABLE Logs(
	Id INT IDENTITY(1, 1) PRIMARY KEY,
  UserCode VARCHAR(10) DEFAULT NULL,
  ItemId INT DEFAULT NULL,
  Activity VARCHAR(10) DEFAULT NULL,
  DeptFrom VARCHAR(10) DEFAULT NULL,
  DeptTo VARCHAR(10) DEFAULT NULL,
  ServerLog DATETIME DEFAULT (current_timestamp)
)

-- selecting an item's department change history
SELECT
Logs.UserCode as authorCode,
Users.FULLNAME as authorName,
Activity.ActDesc as activity,
d1.DeptName as deptFrom,
d2.DeptName as deptTo,
FORMAT (Logs.ServerLog, 'yyyy-MM-dd') as date,
FORMAT (Logs.ServerLog, 'hh:mm tt') as time
FROM Logs
LEFT JOIN Users ON Users.CODE=Logs.UserCode
LEFT JOIN Activity ON Activity.ActCode=Logs.Activity
LEFT JOIN Department d1 ON d1.DeptCode=Logs.DeptFrom
LEFT JOIN Department d2 ON d2.DeptCode=Logs.DeptTo
WHERE ItemId=itemId
AND DeptFrom != DeptTo