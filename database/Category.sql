CREATE TABLE Category(
  CategoryCode VARCHAR(10) PRIMARY KEY,
  CategoryName VARCHAR(255)
)

INSERT INTO Category(
  CategoryCode,
  CategoryName
) VALUES (
  '1',
  'Category 1'
),(
  '2',
  'Category 2'
)
