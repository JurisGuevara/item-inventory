CREATE TABLE Access (
	Id INT IDENTITY(1, 1) PRIMARY KEY,
  UserCode VARCHAR(10),
  Rights VARCHAR(10),
  CategoryCode VARCHAR(10),
  DeptCode VARCHAR(10)
)

INSERT INTO Access(
  UserCode,
  Rights,
  CategoryCode,
  DeptCode
) VALUES (
  'user1',
  'CRU',
  '1',
  '1'
),(
  'user2',
  'CRUD',
  '2',
  '2'
)
