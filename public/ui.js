// Display messages on the page

export class ChatUI {
    constructor(l) {
        this.list = l;
    }

    set list(l) {
        this._list = l;
    }
    get list() {
        return this._list;
    }

    // Date formatting
    formatDate(date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let min = date.getMinutes();

        // Adding 0 in front of single digit values
        day = String(day).padStart(2, "0");
        month = String(month).padStart(2, "0");
        hours = String(hours).padStart(2, "0");
        min = String(min).padStart(2, "0");

        const today = new Date();
        let am_pm = (hours >= 12) ? 'pm' : 'am';

        if (today.toDateString() === date.toDateString()) {
            return `${hours}:${min}${am_pm}`;
        } else {
            return `${day}.${month}.${year}. - ${hours}:${min}${am_pm}`
        }
    }

    // Display on the page
    templateLI(d) {
        let id = d.id;
        let data = d.data();
        let date = data.created_at.toDate();

        if (localStorage.username == data.username || localStorage.username == `Anonymous`) {
            let htmlLI = `
            <li id="${id}" class="right-align">
            <span class="user">${data.username}</span> 
            <span class="msg"> : ${data.message}</span>
            <br>
            <span class="date">${this.formatDate(date)}</span>
            <span><i class="far fa-trash-alt left-icon"></i></span>
            </li>`;
            this.list.innerHTML += htmlLI;
        } else {
            let htmlLI = `
            <li id="${id}" class="left-align">
            <span class="user">${data.username}</span> 
            <span class="msg"> : ${data.message}</span>
            <br>
            <span class="date">${this.formatDate(date)}</span>
            <span><i class="far fa-trash-alt right-icon"></i></span>
            </li>`;
            this.list.innerHTML += htmlLI;
        }
    }

    // Emptying the list on the page
    clear() {
        this.list.innerHTML = ``;
    }
}