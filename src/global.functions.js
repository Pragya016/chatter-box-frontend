import { jwtDecode } from 'jwt-decode'

export function getTimestamp() {
    const date = new Date();
    const hours = date.getHours();
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const timestamp = `${formattedHours}:${formattedMinutes} ${period}`;
    return timestamp;
}

export function getEmail() {
    const token = localStorage.getItem('chatterBoxToken');

    if (token) {
        const payload = jwtDecode(token);
        return payload.email;
    }
}

export function createChat(data, style) {
    const container = document.getElementById('chatBox');
    const messageContainer = document.createElement('div');
    const messageBox = document.createElement('div');
    const usernameBox = document.createElement('p');
    const messageEl = document.createElement('p');
    const time = document.createElement('p');

    messageContainer.className = style.messageContainer;
    messageBox.className = style.messageBox;
    usernameBox.className = style.username;
    messageEl.className = style.message;
    time.className = style.time;

    usernameBox.textContent = data.username;
    messageEl.textContent = data.message;
    time.textContent = data.timestamp;

    messageBox.append(messageEl, time);
    messageContainer.append(usernameBox, messageBox);
    container?.appendChild(messageContainer);
}