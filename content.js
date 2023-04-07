/*
const {Configuration, OpenAIApi} = require('openai');

const config = new Configuration({
    apiKey: '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'
});

const openai = new OpenAIApi(config);
const models = await openai.listModels());

const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Say this is a test",
    max_tokens: 7,
    temperature: 0,
});
*/


document.addEventListener('selectionchange', (e)=>{
    let text = window.getSelection().toString();
    navigator.clipboard.writeText(text);
});
