var games = []

//get references
var BASE_URL = "https://tantiemgithubio-production.up.railway.app"

var createSection = document.querySelector("#create");
var authSection = document.querySelector("#auth");
var viewEditArea = document.querySelector("#viewEditArea");

var emailFieldLog = document.querySelector("#emailLogin");
var passFieldLog = document.querySelector("#passLogin");
var loginButton = document.querySelector("#loginButton");
var invalidLogin = document.querySelector("#loginFail");
invalidLogin.hidden = true;

var fNameReg = document.querySelector("#fNameReg");
var lNameReg = document.querySelector("#lNameReg");
var emailReg = document.querySelector("#emailReg");
var passwordReg = document.querySelector("#passwordReg");
var registerButton = document.querySelector("#registerButton");
var emailExists = document.querySelector("#registerFail");
emailExists.hidden = true;

var titleInput = document.querySelector("#title");
var genreInput = document.querySelector("#genre");
var descInput = document.querySelector("#description");
var timeInput = document.querySelector("#time");
var priceInput = document.querySelector("#price");
var addButton = document.querySelector("#createButton");

var editAreaDiv = document.querySelector("#editArea");

var editTitleInput = document.querySelector("#editTitle");
var editGenreInput = document.querySelector("#editGenre");
var editDescInput = document.querySelector("#editDescription");
var editTimeInput = document.querySelector("#editTime");
var editPriceInput = document.querySelector("#editPrice");
var editSubmitButton = document.querySelector("#editSubmit")

var itemContainerUL = document.querySelector("#itemContainer");


var curSelectedId = -1;
//hide the edit area initially
function HideEditArea()
{
    editAreaDiv.hidden = true;
}
function UnHideEditArea()
{
    editAreaDiv.hidden = false;
}
function ShowAuth()
{
    createSection.hidden = true;
    viewEditArea.hidden = true;
}
function HideAuth()
{
    createSection.hidden = false;
    viewEditArea.hidden = false;
    authSection.hidden = true;
}

ShowAuth();

HideEditArea();

function ClearInput()
{
    
    titleInput.value = "";
    genreInput.value = "";
    descInput.value = "";
    timeInput.value = "";
    priceInput.value = "";
    
}
function ClearEditInput()
{
    editTitleInput.innerHTML = "";
    editGenreInput.innerHTML = "";
    editDescInput.innerHTML = "";
    editTimeInput.innerHTML = "";
    editPriceInput.innerHTML = "";
}

//this is the edit game submission button
function OnEditSubmitPressed()
{
    editGameFromServer(curSelectedId,editTitleInput.value,editGenreInput.value,editDescInput.value,editTimeInput.value,editPriceInput.value);
    ClearEditInput();
    HideEditArea();
}
function OnAddButtonPressed()
{
    createGame(titleInput.value,genreInput.value,descInput.value,timeInput.value,priceInput.value)
    ClearInput();
}
function OnRegisterButtonPressed()
{
    var name = fNameReg.value;
    var lastName = lNameReg.value;
    var email = emailReg.value;
    var password = passwordReg.value;
    createUser(name,lastName,email,password);
}
function OnLoginButtonPressed()
{
    var email = emailFieldLog.value;
    var password = passFieldLog.value;
    createSession(email,password);

}

editSubmitButton.onclick = OnEditSubmitPressed;
addButton.onclick = OnAddButtonPressed;
registerButton.onclick = OnRegisterButtonPressed;
loginButton.onclick = OnLoginButtonPressed;

//user stuff
function createUser(firstName,lastName, email,password){
    var data = "first_name=" + encodeURIComponent(firstName);
    data += "&last_name=" + encodeURIComponent(lastName);
    data += "&email=" + encodeURIComponent(email);
    data += "&password=" + encodeURIComponent(password);
    

    fetch(BASE_URL + "/users",{
        method: 'POST',
        credentials: 'include',
        body:data,
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    }).then(function(response){
        console.log(response);
        if(response.status == 201){
            console.log("The user was successfully created");
            fNameReg.value = "";
            lNameReg.value = "";
            emailReg.value = "";
            passwordReg.value = "";
            emailExists.hidden = true;
        }else{
            console.log("User with that email exists");
            emailExists.hidden = false;
        }
            
    });
};

function createSession(email,password){
    var data = "email=" + encodeURIComponent(email);
    data += "&password=" + encodeURIComponent(password);
    

    fetch(BASE_URL + "/sessions",{
        method: 'POST',
        credentials: 'include',
        body:data,
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    }).then(function(response){
        if(response.status == 201){
            console.log("Login success!");
            invalidLogin.hidden = true;
            HideAuth();
            loadGames();
        }else{
            console.log("Login fail!");
            invalidLogin.hidden = false;
        }
            
    });
};


//create a new game on the server
function createGame(title,genre, description,time,price){
    var data = "title=" + encodeURIComponent(title);
    data += "&genre=" + encodeURIComponent(genre);
    data += "&description=" + encodeURIComponent(description);
    data += "&time=" + encodeURIComponent(time);
    data += "&price=" + encodeURIComponent(price);
    

    fetch(BASE_URL + "/games",{
        method: 'POST',
        credentials: 'include',
        body:data,
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    }).then(function(response){
        loadGames();
    });
};

function getGame(game_id){
    fetch(BASE_URL + "/games/" + game_id).then(function(response){
        response.json().then(function(data){
        game = data;
        console.log("game from the server", game);
        return game;
        });
	});
};

//deletes a game 
function deleteGameFromServer(gameId){
    fetch(BASE_URL + "/games/"+gameId,{
        method: "DELETE",
        credentials: 'include'
    }).then(function(response){
        if(response.status == 200){
            console.log("the game was successfully deleted");
            loadGames();
        }
    });
}

//edits a member
function editGameFromServer(gameId,title,genre,description,time,price){
    var data = "id="+ encodeURIComponent(gameId);
    data += "&title=" + encodeURIComponent(title);
    data += "&genre=" + encodeURIComponent(genre);
    data += "&description=" + encodeURIComponent(description);
    data += "&time=" + encodeURIComponent(time);
    data += "&price=" + encodeURIComponent(price);
    console.log(data);
    fetch(BASE_URL + "/games/"+gameId,{
        method: "PUT",
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
    }).then(function(response){
        if(response.status == 200){
            console.log("the game was successfully edited");
            loadGames();
        }
    });
}

//used for editing
function showEditForm(game){
    UnHideEditArea()
    console.log(game);
    editTitleInput.value = game.title;
    editGenreInput.value = game.genre;
    editDescInput.value = game.description;
    editTimeInput.value = game.time;
    editPriceInput.value = game.price;
};

function AddNewListElementFromGameObject(game,listNode)
{
    /*
    <li>
        <h3>Title: </h3><p class="generatedTitle">Lord of the John</p>
        <h3>Genre: </h3><p>Action Adventure</p>
        <h3>Description: </h3><p>Fantasy setting in which the player must harness the power of plumbing to overcome the evil influence of Dr. Diarrhea</p>
        <h3>Time: </h3><p>2 years</p>
        <h3>Price: </h3><p>$45</p>
        <div class = "editDeleteButtons">
            <button>EDIT</button> <button>DELETE</button>
        </div>
    </li>
    */
   var newListItem = document.createElement("li");

   var titleHeader = document.createElement("h3");
   titleHeader.innerHTML = "Title: "
   var titleText = document.createElement("p");
   titleText.innerHTML = game.title;

   var genreHeader = document.createElement("h3");
   genreHeader.innerHTML = "Genre: ";
   var genreText = document.createElement("p");
   genreText.innerHTML = game.genre;

   var descHeader = document.createElement("h3");
   descHeader.innerHTML = "Description: ";
   var descText = document.createElement("p");
   descText.innerHTML = game.description;

   var timeHeader = document.createElement("h3");
   timeHeader.innerHTML = "Time: ";
   var timeText = document.createElement("p");
   timeText.innerHTML = game.time;

   var priceHeader = document.createElement("h3");
   priceHeader.innerHTML = "Price: "
   var priceText = document.createElement("p");
   priceText.innerHTML = game.price;

   var editDeleteDiv = document.createElement("div");
   editDeleteDiv.className = "editDeleteButtons";
   var perEditButton = document.createElement("button");
   perEditButton.innerHTML = "EDIT";
   var perDeleteButton = document.createElement("button");
   perDeleteButton.innerHTML = "DELETE";

   editDeleteDiv.appendChild(perEditButton);
   editDeleteDiv.appendChild(perDeleteButton);

   newListItem.appendChild(titleHeader);
   newListItem.appendChild(titleText);
   newListItem.appendChild(genreHeader);
   newListItem.appendChild(genreText);
   newListItem.appendChild(descHeader);
   newListItem.appendChild(descText);
   newListItem.appendChild(timeHeader);
   newListItem.appendChild(timeText);
   newListItem.appendChild(priceHeader);
   newListItem.appendChild(priceText);
   newListItem.appendChild(editDeleteDiv);

   listNode.appendChild(newListItem);

   perEditButton.onclick = function(){
		//game = getGame(game.id);
		console.log("edit button was clicked",game.id);
		curSelectedId = game.id;
		showEditForm(game);
    
    }

    perDeleteButton.onclick = function(){
        console.log("delete button was clicked",game.id);

        //ask user if they really want to delete
        if(confirm("Are you sure?")){
        deleteGameFromServer(game.id);
        ClearEditInput();
    }

}
}

//load games from a server as JSON data
function loadGames(){
    fetch(BASE_URL + "/games",{
        credentials:'include'
    }).then(function(response){
        response.json().then(function(data){
        games = data;
        console.log("games from the server", games);
        HideAuth();
        var gameList = document.querySelector("#itemContainer");
        gameList.innerHTML = "";
        games.forEach(function(game){
            AddNewListElementFromGameObject(game,itemContainerUL);
        });
        });
    });
};



loadGames();

