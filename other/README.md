# Game Idea List

## Resource

**Game Ideas**

Attributes:

* title (string)
* genre (string)
* description (string)
* time (string)
* price (integer)

## Schema

```sql
CREATE TABLE games (
id INTEGER PRIMARY KEY,
title TEXT,
genre TEXT,
description TEXT,
time TEXT,
price INTEGER);
```

## REST Endpoints

Name                           | Method | Path
-------------------------------|--------|------------------
Retrieve game collection 	   | GET    | /games
Retrieve game member     	   | GET    | /games/*\<id\>*
Create game member       	   | POST   | /games
Update game member       	   | PUT    | /games/*\<id\>*
Delete game member       	   | DELETE | /games/*\<id\>*