ch = '1';
username = 'Guest';

function getUserName() {
    let name = document.getElementById('name').value
    return name;
}

function getChannel() {
    /*let channels = [];
    fetch('http://0.0.0.0:5000/channels')
        .then(res => res.json())
        .then(data => data.resources)
        .then(data => {
            data.forEach(element => {
                channels.push(element);
            });
        })*/
    let st = '';
    const xhr = new XMLHttpRequest();
    const url = 'http://127.0.0.1:5000/channels/';
    xhr.open('GET', url, true)
    xhr.onload = function () {
        let temp = [];
        if (this.status == 200) {
            temp = JSON.parse(this.responseText).resources;
            temp.forEach(element => {
                st += '<li><a href="#" id="' + element.id + '" class="channels" onClick="openChannel(this);">' + element.name + '</a></li>';
            });
            document.getElementById('list-container').innerHTML = st;
        }
    }
    xhr.send();
    //return channels
}

function postChannel(channel) {
    const url = 'http://127.0.0.1:5000/channels/';
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({ 'name': channel })
    }).then(() => getChannel())
        .catch(err => console.log(err));
}

function postMessage(userName, channelId, message) {
    const url = 'http://127.0.0.1:5000/messages/';
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({ 'channel_id': channelId, 'text': message, 'username': userName })
    })
        .then(() =>retriveMessage(ch))
        .catch(err => console.log(err));

    broadcastMessage(userName,channelId,message)
}

function broadcastMessage(userName, channelId, message) {
    const url = 'http://127.0.0.1:5000/broadcast';
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({ 'channel_id': channelId, 'text': message, 'username': userName })
    })
        .then(() =>retriveMessage(ch))
        .catch(err => console.log(err));
}

function retriveMessage(channelId) {
    let message = '';
    fetch('http://127.0.0.1:5000/messages/')
        .then(res => res.json())
        .then(data => data['resources'])
        .then(data => {
            data.forEach(element => {
                if (element['channel_id'] == channelId)
                    message += '<li><span>'+element.username+': </span>'+ element.text + '</li>';
            });
            document.getElementById('messages-box').innerHTML = message;
        })
}
function onlogin() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('channel-area').style.display = 'block';
    document.getElementById('chat-area').style.display = 'block';
    getChannel();
    retriveMessage('1')
    username = getUserName();
    document.getElementById('chat-area-head').innerHTML = 'Channel 1'
    document.getElementById('welcome-msg').innerHTML = ('Welcome ' + username);
}

function openChannel(ele) {
    retriveMessage(ele.id);
    ch = ele.id;
    document.getElementById('chat-area-head').innerHTML = ele.innerHTML
}

function send() {
    let temp = '';
    temp = document.getElementById('message').value;
    if (temp !== '') {
        postMessage(username, ch, temp);
        //retriveMessage(ch);
    }

    document.getElementById('message').value = "";
}
function addChannel() {
    let temp = ''
    temp = document.getElementById('add-channel-input').value;
    if (temp!==''){
    postChannel(temp);
    }
    document.getElementById('add-channel-input').value = '';
}
document.getElementById('submit-name').addEventListener('click', onlogin);
document.getElementById('send').addEventListener('click', send);
document.getElementById('add-channel').addEventListener('click', addChannel)


