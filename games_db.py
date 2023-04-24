import sqlite3
import os
import psycopg2
import psycopg2.extras
import urllib.parse


#first, use sqlite3 in terminal to create a database:
#CREATE TABLE highscores (id INTEGER PRIMARY KEY, name TEXT, score INTEGER);
#CREATE TABLE users (id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT, email TEXT, password TEXT);

def dict_factory(cursor, row):
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}

class GamesDB:

    def __init__(self) -> None:
        #self.connection = sqlite3.connect("games_db.db")
        #self.connection.row_factory = dict_factory
        #self.cursor = self.connection.cursor()
        urllib.parse.uses_netloc.append("postgres")
        url = urllib.parse.urlparse(os.environ["DATABASE_URL"])

        self.connection = psycopg2.connect(
            cursor_factory=psycopg2.extras.RealDictCursor,
            database=url.path[1:],
            user=url.username,
            password=url.password,
            host=url.hostname,
            port=url.port
        )

        self.cursor = self.connection.cursor()

    def __del__(self):
        self.connection.close()

    def createTables(self):
        self.cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT, email TEXT, password TEXT)")
        self.connection.commit()

        self.cursor.execute("CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY, title TEXT, genre TEXT, description TEXT, time TEXT, price INTEGER)")
        self.connection.commit()

    def createUser(self,firstName,lastName,email,password):
        data = [firstName,lastName,email,password]
        self.cursor.execute("INSERT INTO users(first_name,last_name,email,password) VALUES(%,%,%,%)",data)
        self.connection.commit()
    
    def findUserByEmail(self,email):
        self.cursor.execute("SELECT * FROM users WHERE email = %", [email])
        foundUser = self.cursor.fetchone()
        return foundUser

    def createGame(self,title,genre,desc,time,price):
        #INSERT record
        data = [title,genre,desc,time,price]
        self.cursor.execute(f"INSERT INTO games (title, genre, description, time, price) VALUES (%,%,%,%,%)",data) #prevent data binding, sql injection
        self.connection.commit()

    #returns a list of dictionaries (or an empty list if there are no records)
    def getAllGames(self):
        #read all records
        self.cursor.execute("SELECT * FROM games")
        records = self.cursor.fetchall()
        print(records)
        return records

    #returns a single dict (or None if the id does not exist)
    def getOneGame(self,game_id):
        data = [game_id]
        self.cursor.execute("SELECT * FROM games WHERE id = %",data)
        record = self.cursor.fetchone()
        return record

    def updateGame(self,game_id,title,genre,desc,time,price): #video game ID, name, character, achievement, others
        data = [title,genre,desc,time,price,game_id]
        self.cursor.execute("UPDATE games SET title = %, genre = %, description = %, time = %, price = % WHERE id = %",data)
        self.connection.commit()
        

    def deleteGame(self,game_id): #which video game? ID. almost exactly the same as get one
        data = [game_id]
        self.cursor.execute("DELETE FROM games WHERE id = %",data)
        self.connection.commit()
        

#DELETE FROM movies WHERE id = %

#UPDATE movies SET name = %, rating = %, genre = % WHERE id = %









