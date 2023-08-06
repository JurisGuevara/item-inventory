CREATE TABLE Activity(
  ActCode VARCHAR(10),
  ActDesc VARCHAR(50),
)

INSERT INTO Activity(
  ActCode,
  ActDesc
)VALUES(
  'C',
  'CREATE'
),(
  'R',
  'READ'
),(
  'U',
  'UPDATE'
),(
  'D',
  'DELETE'
)
