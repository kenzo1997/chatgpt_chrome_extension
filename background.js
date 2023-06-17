const API_KEY = 'Bearer API_KEY_HERE';

async function getCompletions(commandInfo, selectionText) {
    let response = await fetch('https://api.openai.com/v1/completions', {
        method: "POST",
        headers: {
            "content-tpye": "application/json",
            Authorization: API_KEY
        },
        body: {
            'model': commandInfo.model,
            'prompt': commandInfo.command + selectionText,
            'max_tokens': commandInfo.tokens,
            'temparture': commandInfo.temparture
        }
    });
    
    return response.json(); 
}

chrome.storage.local.set({"key": []});

chrome.contextMenus.create({
    id: "1",
    title: "chromeGTP",
    contexts: ["all"]
});

chrome.storage.local.get(["key"]).then((result) => {
    if(result.key.lenght !== 0) {
        for(let opt of result.key) {
            chrome.contextMenus.create({
                id: opt.name,
                title: opt.name + "\"%s\"",
                parentId: "1",
                contexts: ["selection"],
            })
        }
    }
});

chrome.storage.onChanged.addListener((changes, _namespace) => {
    for(let ov of changes.key.oldValue) {
        chrome.contextMenus.remove(ov.name)
    }

    let opts = changes.key.newValue || [];
    
    for(let opt of opts) {
        chrome.contextMenus.create({
            id: opt.name,
            title: opt.name + "\"%s\"",
            parentId: "1",
            contexts: ["selection"],
        })
    }
});

chrome.contextMenus.onClicked.addListener(function(info, _tab) {
    let id = info.menuItemId;

    chrome.storage.local.get(["key"]).then((result) => {
        let commandInfo = null;
        
        for( let k of result.key) {
            if(id === k.name) {
                commandInfo = k;
            }
        }
        
        getCompletions(commandInfo, info.selectionText).then(response => {
            let message = response.choices[0].text;
            
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, {action: message}, (_response) => {});  
            });
        }).catch(e => console.error("ERROR: "+ e))
    });
});
