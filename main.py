#pip3 install bcrypt passlib

#h = bcrypt.hash("secretssecrets")
## save this line encrypted password to the database instead
#bcrypt.verify("secretsecrets",h)
# given: email and password from client
# 	get user with given email from DB
#	if user exists?
#		check password matches user
# 	else :(

# 401 is credentials didnt hceck out code
# 201 is success code


# cookies, user has a cookie jar
# client to server interaction transfers the cookies side to side
# the server has a database and a session store that it read/writes to
# 

#Register with existing user
#Register new user
#login with new user, with bad email / password
#Login with correct email / password
#refresh page, stay logged in
#check user id for all the protected resource data

from http.server import BaseHTTPRequestHandler, HTTPServer
from sys import path_importer_cache
from urllib.parse import parse_qs
import json

from games_db import GamesDB

from socketserver import ThreadingMixIn

from http import cookies
from session_store import SessionStore
import os
from passlib.hash import bcrypt


SESSION_STORE = SessionStore()

HIGHSCORES = {}

def JSONToDict(JSON):
	for dict in JSON:
		for key in dict:
			HIGHSCORES[key] = dict[key]
	print(HIGHSCORES)
	

db = GamesDB()

#JSONToDict(db.readAllRecords())

class MyRequestHandler(BaseHTTPRequestHandler):

	def end_headers(self):
		self.send_cookie()
		self.send_header("Access-Control-Allow-Origin",self.headers["Origin"])
		self.send_header("Access-Control-Allow-Credentials","true")
		super().end_headers()

	def load_cookie(self):
		if "Cookie" in self.headers:
			self.cookie = cookies.SimpleCookie(self.headers["Cookie"])
		else:
			self.cookie = cookies.SimpleCookie()

	def send_cookie(self):
		for morsel in self.cookie.values():
			print(morsel.keys())
			morsel["samesite"] = "None" #comment for postman
			morsel["secure"] = True     #comment for postman
			self.send_header("Set-Cookie",morsel.OutputString())

	def loadSession(self):
		# load the cookie data
		self.load_cookie()
		# check for existence of the session ID cookie
		
		# if the session ID cookie exists:
		if 'sessionId' in self.cookie:
			# load the session data for the session ID
			sessionId = self.cookie['sessionId'].value
			self.sessionData = SESSION_STORE.getSessionData(sessionId) #one of the green boxes from session store
			#if session ID is not valid:
			if self.sessionData == None:
				# create a new session / session ID
				sessionId = SESSION_STORE.createSession()
				# save the new session ID into a cookie
				self.cookie['sessionId'] = sessionId
				# load the session
				self.sessionData = SESSION_STORE.getSessionData(sessionId)
		else:
			# create a new session / session ID
			sessionId = SESSION_STORE.createSession()
			# save the new session ID into a cookie
			self.cookie['sessionId'] = sessionId
			# load the session
			self.sessionData = SESSION_STORE.getSessionData(sessionId)
	
	def handleCreateUsers(self):
		length = int(self.headers["content-length"])
		request_body = self.rfile.read(length).decode("utf-8")
		parsed_body = parse_qs(request_body)
		print("The parsed body: ", parsed_body)

		firstName = parsed_body["first_name"][0]
		lastName = parsed_body["last_name"][0]
		email = parsed_body["email"][0]
		password = parsed_body["password"][0]
		encryptedPassword = bcrypt.hash(password)

		db = GamesDB()
		userFound = db.findUserByEmail(email)
		print(userFound)
		if userFound is not None:
			self.send_response(422)
			self.end_headers()
			self.wfile.write(bytes("User couldn't be created: email already exists!","utf-8"))
			return
        
		db.createUser(firstName, lastName, email,encryptedPassword)
		#respond with success
		self.send_response(201)
		self.end_headers()
		self.wfile.write(bytes("User was created","utf-8"))

	def handleCreateSessions(self):
		length = int(self.headers["content-length"])
		request_body = self.rfile.read(length).decode("utf-8")
		parsed_body = parse_qs(request_body)
		print("The parsed body: ", parsed_body)
		
		email = parsed_body["email"][0]
		password = parsed_body["password"][0]	

		db = GamesDB()
		user = db.findUserByEmail(email)
		print(user)
		if user is not None:
			if bcrypt.verify(password,user["password"]):
				self.send_response(201)
				self.end_headers()
				print("session data create")
				self.sessionData["userId"] = user["id"]
			else:
				self.handle401()
		else:
			self.handle401()

	def handleNotFound(self):
		self.send_response(404)
		self.send_header("Content-Type","text/plain")
		self.end_headers()
		self.wfile.write(bytes("Not found.", "utf-8"))

	def handle401(self):
		self.send_response(401)
		self.send_header("Content-Type","text-plain")
		self.end_headers()
		self.wfile.write(bytes("Not Authenticated","utf-8"))
	
	def handleGetGames(self):
		if 'userId' not in self.sessionData:
			self.handle401()
			return

		db = GamesDB()
		all_games = db.getAllGames()
		# response status code:
		self.send_response(200)
		# response header:
		self.send_header("Content-Type","application/json")
		#self.send_header("Access-Control-Allow-Origin","*")
		#self.send_header("Set-Cookie", "flavor = biscoff")
		self.end_headers()
		# response body:
		self.wfile.write(bytes(json.dumps(all_games),"utf-8"))

	def handleGetGamesMember(self, game_id):
		if 'userId' not in self.sessionData:
			self.handle401()
			return

		db = GamesDB()
		game = db.getOneGame(game_id)

		if game != None:
			# response status code:
			self.send_response(200)
			# response header:
			self.send_header("Content-Type","application/json")
			#self.send_header("Access-Control-Allow-Origin","*")
			self.end_headers()
			# response body:
			self.wfile.write(bytes(json.dumps(game),"utf-8"))
		else:
			self.handleNotFound()
	##we need to make delete member and replace (update) member
	##replace is like create and retrieve
	##delete is like retrieve

	def handlePostHS(self):
		if 'userId' not in self.sessionData:
			self.handle401()
			return

		# 1. read data in the request body
		contentLength = int(self.headers["Content-Length"])
		requestBody = self.rfile.read(contentLength).decode("utf-8")
		parsedBody = parse_qs(requestBody)
		print(parsedBody)

		
		# 2. manipulate server data, append to HIGHSCORES
		game_name = parsedBody["title"][0]#index the dictionary and list
		game_genre = parsedBody["genre"][0] #index the dictionary and list
		game_desc = parsedBody["description"][0]
		game_time = parsedBody["time"][0]
		game_price = parsedBody["price"][0]

		db = GamesDB()
		db.createGame(game_name,game_genre,game_desc,game_time,game_price)
		
		#db.saveRecord(HIGHSCORES)
		
		print(HIGHSCORES)
		
		# 3. send a response
		self.send_response(201)

		#self.send_header("Access-Control-Allow-Origin","*")

		self.end_headers()

	def handleUpdateGame(self,member_id):
		if 'userId' not in self.sessionData:
			self.handle401()
			return

		length = int(self.headers["content-length"])
		request_body = self.rfile.read(length).decode("utf-8")
		print("raw request body: ",request_body)
		parsed_body = parse_qs(request_body)
		print("The parsed body: ", parsed_body)
		gameId = parsed_body["id"][0]

		gameTitle = parsed_body["title"][0]
		gameGenre = parsed_body["genre"][0]
		gameDesc = parsed_body["description"][0]
		gameTime = parsed_body["time"][0]
		gamePrice = parsed_body["price"][0]

		db = GamesDB()
		oneGame = db.getOneGame(gameId)		
		if member_id != gameId:
			self.handleNotFound()
		elif oneGame:
			db.updateGame(gameId,gameTitle,gameGenre,gameDesc,gameTime,gamePrice)
			#send status code
			self.send_response(200)
			#self.send_header("Access-Control-Allow-Origin","*")
			self.end_headers()
			self.wfile.write(bytes("Game successfully updated","utf-8"))
		else:
			self.handleNotFound()

	def handleDeleteGame(self,gameId):
		if 'userId' not in self.sessionData:
			self.handle401()
			return

		db = GamesDB()
		game = db.getOneGame(gameId)
		if game:
			db.deleteGame(gameId)
			self.send_response(200)
			#self.send_header("Access-Control-Allow-Origin","*")
			self.end_headers()
		else:
			self.handleNotFound()

	def do_DELETE(self):
		self.loadSession()
		path_parts = self.path.split("/")
		if len(path_parts) > 2:
			collection_name = path_parts[1]
			member_id = path_parts[2]
		else:
			collection_name = path_parts[1]
			member_id = None
		if collection_name == 'games':
			if member_id == None:
				self.handleNotFound()
			else:
				self.handleDeleteGame(member_id)
		else:
			print("failed 2")
			#simple 404 response
			self.handleNotFound()
		

	def do_GET(self):
		self.loadSession()
		path_parts = self.path.split("/")
		if len(path_parts) == 3:
			collection_name = path_parts[1]
			member_id = path_parts[2]
		else:
			collection_name = path_parts[1]
			member_id = None

		if collection_name == "games":
			if member_id:
				self.handleGetGamesMember(member_id)
			else:
				self.handleGetGames()
		else:
			self.handleNotFound()

		#if(self.path == "/highscores"):
		#	self.handleGetHS()
		#else:
		#	self.handleNotFound()

	def do_POST(self):
		self.loadSession()
		if(self.path == "/games"):
			self.handlePostHS()
		elif self.path == "/users":
			self.handleCreateUsers()
		elif self.path == "/sessions":
			self.handleCreateSessions()
		else:
			self.handleNotFound()

	def do_PUT(self):
		self.loadSession()
		path_parts = self.path.split("/")
		if len(path_parts) > 2:
			collection_name = path_parts[1]
			member_id = path_parts[2]
		else:
			collection_name = path_parts[1]
			member_id = None

		if collection_name == "games":
			if member_id == None:
				self.handleNotFound()
			else:
				self.handleUpdateGame(member_id)
		else:
            #simple 404 response
			self.handleNotFound()

	def do_OPTIONS(self):
		self.loadSession()
		self.send_response(200)
		#self.send_header("Access-Control-Allow-Origin","*")
		self.send_header("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS")
		self.send_header("Access-Control-Allow-Headers","Content-Type")
		self.end_headers()
	
	


class ThreadedHTTPServer(ThreadingMixIn,HTTPServer):
	pass

def run():
	db = GamesDB()
	db.createTables()
	db = None #disconnect

	port = 8080
	if "PORT" in os.environ:
		port = int(os.environ["PORT"])
	
	listen = ("0.0.0.0", port)
	server = ThreadedHTTPServer(listen,MyRequestHandler)

	print("Server running!")
	server.serve_forever()

if __name__ == '__main__':
	run()
