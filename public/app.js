import { Chatroom } from "./chat.js";
import { ChatUI } from "./ui.js";

///////////////////////// DOM /////////////////////////

// Ul list
let ulTree = document.getElementById(`list-tree`);
let allNavLi = document.querySelectorAll(`#choose-room`);
// Msg
let formMsg = document.getElementById(`formMsg`);
let inputMsg = document.getElementById(`inputMsg`);
let btnMsg = document.getElementById(`btnSend`);
// Username
let formUser = document.getElementById(`formUser`);
let inputUser = document.getElementById(`inputUsername`);
let btnUpdate = document.getElementById(`btnUpdate`);
let writeUserName = document.getElementById(`writeUserName`);
// Room
let ulRooms = document.getElementById(`choose-room`);
// Color
let inputColor = document.getElementById(`inputColor`);
let btnColor = document.getElementById(`btnColor`);
let sectionMsgList = document.getElementById(`msgList`);
// Filter Dates
let inputDate1 = document.getElementById(`inputDate-1`);
let inputDate2 = document.getElementById(`inputDate-2`);
let btnDate = document.getElementById(`btnDate`);

///////////////// Class objects / Class instance ///////////////

let username = `Anonymous`;
if (localStorage.username) {
    username = localStorage.username;
}
let room = `general`;
if (localStorage.room) {
    room = localStorage.room;
} else {
    localStorage.setItem(`general`, room);
}
let chatroom = new Chatroom(room, username);
let chatUI = new ChatUI(ulTree);

////////////////////////////////////////////////////////////////

// Display documents on the page from the db
chatroom.getChats(d => {
    chatUI.templateLI(d);
    window.document.querySelector('#list-tree').scrollBy(0, 2000);
});

// Send message
btnMsg.addEventListener(`click`, e => {
    e.preventDefault();

    let msg = inputMsg.value;
    inputMsg.value = ``;

    if (msg.trim() != ``) {
        chatroom.addChat(msg)
            .then(() => {
                formMsg.reset();
                window.document.querySelector('#list-tree').scrollBy(0, 2000);
            })
            .catch(err => {
                console.log(`Error: ${err}`);
            });
    } else {
        alert(`Message can not be empty!`);
    }

});

// Update username
btnUpdate.addEventListener(`click`, e => {
    e.preventDefault();

    let newUsername = inputUser.value;

    chatroom.username = newUsername;
    chatroom.updateUsername(newUsername);

    // Display on the page when a username is changed
    if (localStorage.username === newUsername) {
        writeUserName.innerHTML = `New username: ${newUsername}`;
        writeUserName.classList.add(`change-username`);
        setTimeout(() => {
            writeUserName.innerHTML = ``;
            location.reload();
        }, 3000);
    };

    formUser.reset();
});

// Update room
ulRooms.addEventListener(`click`, e => {
    e.preventDefault();

    if (e.target.id) {
        chatUI.clear();

        chatroom.updateRoom(e.target.id);
        allNavLi.forEach(li => {
            if (e.target === li.childNodes[1]) {
                li.childNodes[1].classList.add(`active`);
                li.childNodes[3].classList.remove(`active`);
                li.childNodes[5].classList.remove(`active`);
                li.childNodes[7].classList.remove(`active`);
            } else if (e.target === li.childNodes[3]) {
                li.childNodes[1].classList.remove(`active`);
                li.childNodes[3].classList.add(`active`);
                li.childNodes[5].classList.remove(`active`);
                li.childNodes[7].classList.remove(`active`);
            } else if (e.target === li.childNodes[5]) {
                li.childNodes[1].classList.remove(`active`);
                li.childNodes[3].classList.remove(`active`);
                li.childNodes[5].classList.add(`active`);
                li.childNodes[7].classList.remove(`active`);
            } else if (e.target === li.childNodes[7]) {
                li.childNodes[1].classList.remove(`active`);
                li.childNodes[3].classList.remove(`active`);
                li.childNodes[5].classList.remove(`active`);
                li.childNodes[7].classList.add(`active`);
            }
        })

        chatroom.getChats(d => {
            chatUI.templateLI(d);
            window.document.querySelector('#list-tree').scrollBy(0, 2000);
        });

        localStorage.setItem(`room`, e.target.id)
    };
});

// Update Color
btnColor.addEventListener(`click`, e => {
    e.preventDefault();

    let selectColor = inputColor.value;

    setTimeout(() => {
        sectionMsgList.style.backgroundColor = selectColor;
    }, 500);
    localStorage.setItem(`background-color`, selectColor);
});
sectionMsgList.style.backgroundColor = localStorage.getItem(`background-color`);

// Filter Msg by date
btnDate.addEventListener(`click`, e => {
    e.preventDefault();

    // Start Date
    let startDate = inputDate1.value;
    startDate = new Date(startDate);
    startDate = firebase.firestore.Timestamp.fromDate(startDate);
    // End Date    
    let endDate = inputDate2.value;
    endDate = new Date(endDate);
    endDate = firebase.firestore.Timestamp.fromDate(endDate);

    chatUI.clear();
    // If dates are not selected
    if (inputDate1.value == `` || inputDate2.value == ``) {
        return chatroom.getChats(d => {
            chatUI.templateLI(d);
            window.document.querySelector('#list-tree').scrollBy(0, 2000);
        });
    }

    // Filtering and displaying on the page
    db.collection(`chats`)
        .where(`created_at`, `>=`, startDate)
        .where(`created_at`, `<=`, endDate)
        .get()
        .then(snapshot => {
            if (!snapshot.empty) {
                let allDocs = snapshot.docs;
                allDocs.forEach(doc => {
                    let msg = doc.data();
                    if (msg.room === localStorage.room) {
                        chatUI.templateLI(doc);
                    }
                    window.document.querySelector('#list-tree').scrollBy(0, 2000);
                });
            } else {
                alert(`There is no message with the given date!`);
            }
        })
        .catch(err => {
            console.log(`Error: ${err}`);
        });
});

// Deleting messages
ulTree.addEventListener(`click`, function (e) {
    e.preventDefault();

    if (e.target.tagName === `I`) {
        let user = e.target.closest(`li`);
        let userName = user.childNodes[1].innerHTML;
        let span = e.target.parentElement;
        let li = span.parentElement;
        let liId = li.id;

        if (localStorage.username === userName) {
            if (confirm(`Do you want to permanently delete the message?`)) {
                li.remove();
                chatroom.deleteMsg(liId);
            }
        } else {
            li.remove();
        }
    };

});
