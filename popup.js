const API_KEY = 'Bearer API_KEY_HERE';

async function loadModels() {
    let response = await fetch('https://api.openai.com/v1/models', {
        method: "GET",
        headers: {
            "content-tpye": "application/json",
            Authorization: API_KEY
        } 
    });
    
    return response.json();
}

function createNode(type, value, dest) {
    const node = document.createElement(type);
    
    let titleNode = document.createElement('p');
    let deleteNode = document.createElement('p');

    const titleTextNode = document.createTextNode(value);
    const deleteTextNode = document.createTextNode('X');
    
    titleNode.append(titleTextNode);
    titleNode.onclick = () => edit(value);
    
    deleteNode.append(deleteTextNode);
    deleteNode.onclick = () => deleteCommand(value);
    deleteNode.setAttribute('id', 'deleteBtn');

    node.appendChild(titleNode);
    node.appendChild(deleteNode);
    node.setAttribute('id', value);

    document.getElementById(dest).appendChild(node);
}

document.addEventListener("DOMContentLoaded", function() {
    loadModels().then(response => {
        let models = response.data;

        for(let model of models) {
            const node = document.createElement('option');
            const textNode = document.createTextNode(model.id);
            node.append(textNode);
            document.getElementById('model').appendChild(node);
        }
    });

    chrome.storage.local.get(["key"]).then((result) => {
        for( r of result.key) {
            createNode('li', r.name, 'commands');
        }
    });

    document.getElementById("button1").addEventListener("click", function() {
        let x =document.getElementById("button1").innerHTML;

        let name = document.getElementById("name").value;
        let instruction = document.getElementById("instruction").value;
        let tokens = document.getElementById('tokens').value;
        let temparture = document.getElementById('temparture').value;
        let model = document.getElementById('model').value; 

        let command = {
            "name": name,
            "command": instruction,
            "tokens": tokens,
            "temparture": temparture,
            'model': model
        };
        
        if(name.length !== 0) {
            chrome.storage.local.get(["key"]).then((result) => {
                if(x === "SAVE") {
                    let d = result.key.find(e => e.name === command.name);
                
                    if(d === undefined) {
                        createNode('li', name, 'commands');
                        let newCommands = [...result.key, command];
                        chrome.storage.local.set({ "key": newCommands });
                    } else {
                        alert("command with this name already esxists.");
                    } 
                } else if(x === "UPDATE") {
                    let objIndex = result.key.findIndex(obj => obj.name === name);
                    result.key[objIndex] = command;
                    chrome.storage.local.set({"key": [...result.key]});
        
                    document.getElementById('button1').innerHTML = 'SAVE';
                    document.getElementById("name").disabled = false;
                }
            });
        } 

        document.getElementById("name").value = "";
        document.getElementById("instruction").value = "";
        document.getElementById("tokens").value = "";
        document.getElementById("temparture").value = "";
    });
});

function edit(name) {
    chrome.storage.local.get(["key"]).then((result) => {
        let res = result.key.find(r => r.name === name);
        
        document.getElementById("name").value = res.name;
        document.getElementById("instruction").value = res.command;
        document.getElementById('tokens').value = res.tokens;
        document.getElementById('temparture').value = res.temparture;
        document.getElementById('model').value = res.model;

        document.getElementById('button1').innerHTML = 'UPDATE';
        document.getElementById("name").disabled = true;
    });
}

function deleteCommand(name) {
    chrome.storage.local.get(["key"]).then((result) => {
        let res = result.key.filter(r => r.name !== name);
        chrome.storage.local.set({"key": [...res]});
    })

    document.getElementById(name).remove();
}
