export class Chatroom {
    constructor(rm, un){
        this.room = rm;
        this.username = un;
        this.chats = db.collection(`chats`);
        this.unsub = false;
    }

    set room(rm){
        this._room = rm;
    }
    get room(){
        return this._room;
    }

    set username(un){
        this._username = un;
    }
    get username(){
        return this._username;
    }

    // Adding a new message
    async addChat(msg){
        let date = new Date();
        let date_ts = firebase.firestore.Timestamp.fromDate(date);

        // Creating a document/object that I pass to the database
        let docChat = {
            message: msg,
            username: this.username,
            room: this.room,
            created_at: date_ts
        };

        let response = await this.chats.add(docChat)

        return response;
    }

    // A method that tracks changes in the database and returns messages
    getChats(callback){
        this.unsub = this.chats
        .where(`room`,`==`, this.room)
        .orderBy(`created_at`, `asc`)
        .onSnapshot( snapshot => {
            snapshot.docChanges().forEach( change => {
                if(change.type == `added`){
                    callback(change.doc); 
                }
            })            
        });
    }

    // Deleting messages
    deleteMsg(id){
        this.chats
        .doc(id)
        .delete()
        .then(() => {
            alert(`Successfully deleted chat!`)
        })
        .catch(err => {
            console.log(`Error: ${err}`);
        });
    }

    // Username validation
    validateUsername(un) {
        if(un.trim() != `` && un.trim().length >= 2 && un.trim().length <= 10) {
            return true;
        }
        else {
            return false;
        }
    }

    // When the name validation has passed, the record goes
    updateUsername(newUsername) {
        if (this.validateUsername(newUsername) === true) {
            this.username = newUsername;
            localStorage.setItem(`username`, newUsername);
        }
        else {
            alert(`Username must be between 2 and 10 characters !`);
        }
    }

    // Update room
    updateRoom(roomUpdate){
        this.room = roomUpdate;
        if(this.unsub != false) { 
            this.unsub();
        }
    }
}

