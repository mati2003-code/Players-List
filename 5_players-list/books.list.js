window.onload = function () {
  console.log("App started");
  playersList.init();
};

class Player {
  constructor(playersName, playersAge, playersPosition) {
    this.playersName = playersName;
    this.playersAge = playersAge;
    this.playersPosition = playersPosition;

    this.id = Date.now(); // timestamp
  }
}


class PlayersList {
   constructor () {
    this.players = [];
   }

   init() {
    document.getElementById("saveButton").addEventListener('click', (e) => {this.saveButton(e)});

    this.loadDataFromStorage();
   }

   loadDataFromStorage() {
    const data = storage.getItems();
    if(data == null || data == undefined) {
      return;
    } 
    this.players = data;

    data.forEach((value,index) => {
      ui.addBookToTable(value);
    });
   }

   saveButton(e) {
    console.log("save button");

    const playersAge = document.getElementById("playersAge").value;
    const playersName = document.getElementById("playersName").value;
    const playersPosition = document.getElementById("playersPosition").value;
   
    if(playersAge === "" || playersName === "" || playersPosition === "") {
      console.log("blank data");
      return;
    }

    e.preventDefault();
    const player = new Player(playersName, playersAge, playersPosition);
    this.addBook(player);
   }

   addBook(player) {
    this.players.push(player);
    ui.addBookToTable(player);
    this.saveData();
   }

   removeBookById(playerId) {
    this.players.forEach((el, index) => {
      if(el.id == playerId) this.players.splice(index, 1);
    });

    this.saveData();
   }

   moveBookUp(playerId) {
      let arr = this.players;

      for(let a = 0; a < arr.length; a++) {
          let el = arr[a];

          if (el.id == playerId) {
            if(a >= 1) {
              let temp = arr[a - 1];
              arr[a - 1] = arr[a];
              arr[a] = temp;
              break;
            }
          }
      }

      this.saveData();
      ui.deleteAllBookRows(); 
      this.loadDataFromStorage();
   }

   moveBookDown(playerId) {
    let arr = this.players;

    for(let a = 0; a < arr.length; a++) {
        let el = arr[a];

        if (el.id == playerId) {
          if(a <= arr.length - 2) {
            let temp = arr[a + 1];
            arr[a + 1] = arr[a];
            arr[a] = temp;
            break;
          }
        }
    }

    this.saveData();
    ui.deleteAllBookRows(); 
    this.loadDataFromStorage();
   }

   saveData() {
    storage.saveItems(this.players);
   }
}

const playersList = new PlayersList();


class Ui {

  deleteBook(e){
    const playerId = e.target.getAttribute("data-book-id");

    e.target.parentElement.parentElement.remove();
    playersList.removeBookById(playerId);
  }

  deleteAllBookRows() {
    const tbodyRows = document.querySelectorAll("#playersTable tbody tr");

    tbodyRows.forEach(function (el) {
      el.remove();
    });
  }

  addBookToTable(player) {
    const tbody = document.querySelector("#playersTable tbody");
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td> ${player.playersName} </td>
      <td> ${player.playersAge} </td>
      <td> ${player.playersPosition} </td>
      <td> 
        <button type="button" data-book-id="${player.id}" 
          class="btn btn-danger brn-sm delete">Skasuj</button>
        <button type="button" data-book-id="${player.id}" 
          class="btn btn-secondary brn-sm up-arrow">▲</button>
        <button type="button" data-book-id="${player.id}" 
        class="btn btn-secondary brn-sm  down-arrow">▼</button>
      </td>
    `;

    tbody.appendChild(tr);

    let deleteButton = document.querySelector(`button.delete[data-book-id="${player.id}"]`);
    deleteButton.addEventListener('click', (e) => this.deleteBook(e));

    let upButton = document.querySelector(`button.up-arrow[data-book-id="${player.id}"]`);
    upButton.addEventListener('click', (e) => this.arrowUp(e));

    let downButton = document.querySelector(`button.down-arrow[data-book-id="${player.id}"]`);
    downButton.addEventListener('click', (e) => this.arrowDown(e));

    this.clearForm();
  }


  arrowUp(e) {
    let playerId = e.target.getAttribute("data-book-id");
    console.log("up", playerId);
    playersList.moveBookUp(playerId);
  }
  arrowDown(e) {
    let playerId = e.target.getAttribute("data-book-id");
    console.log("down", playerId);
    playersList.moveBookDown(playerId);
  }

  clearForm() {
    document.getElementById("playersName").value = "";
    document.getElementById("playersAge").value = "";
    document.getElementById("playersPosition").value = "";

    document.getElementById("playersForm").classList.remove("was-validated");
  }
}


const ui = new Ui(); 

class Storage {

  getItems() {
    let players = null; 

    if(localStorage.getItem("books") !== null) {
      players = JSON.parse(localStorage.getItem("books"));
    } else {
      players = [];
    }

    return players;
  }

  saveItems (players){
    localStorage.setItem("books", JSON.stringify(players));
  }
}

const storage = new Storage();

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()