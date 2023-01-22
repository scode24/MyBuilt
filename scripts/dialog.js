let askBox = undefined;
let messageUl = undefined;
let mydata = undefined;
let candName = undefined;

const negativeWordsList = ["no", "not", "don't", "dont", "never"];
const positiveWordsList = ["what", "where", "tell"];

const displayMessage = (type, message) => {

    if (message == "")
        return;

    let li = document.createElement("li");

    if (type == "send") {
        li.setAttribute("class", "right")
        li.innerHTML = "<div class='message-bubble'> <div class='message'>" + message + " </div><div class='triangle-right'></div></div>"
    }

    if (type == "reply") {
        li.setAttribute("class", "left")
        li.innerHTML = "<div class='message-bubble'> <div class='triangle-left'></div><div class='message'>" + message + " </div></div>"
    }

    messageUl.appendChild(li);
    messageUl.scrollTop = messageUl.scrollHeight;
    askBox.value = "";

    if (type == "send")
        prepareReplyOn(message);
}

const prepareReplyOn = (message) => {
    let positiveWordCount = 0;
    let negativeWordCount = 0;
    let tokens = message.split(" ");
    let dataTokensList = [];

    tokens.forEach(token => {
        token = token.toLowerCase();
        if (positiveWordsList.indexOf(token) > -1)
            positiveWordCount++;
        else if (negativeWordsList.indexOf(token) > -1)
            negativeWordCount++;
        else
            storeToListIfValidToken(dataTokensList, token);
    });

    if (negativeWordCount > 0 && positiveWordCount > 0 && negativeWordCount == positiveWordCount)
        displayMessage("reply", "Sorry, didn't get your question. Would you like to ask anything else ?");
    else if (negativeWordCount > positiveWordCount)
        displayMessage("reply", "Would you like to ask anything else ?");
    else {
        dataTokensList.forEach(token => {
            data = JSON.parse(localStorage.getItem("data"));
            displayMessage("reply", JSON.stringify(data[0][token]));
        });
    }
}

const storeToListIfValidToken = (list, token) => {
    if (token.toLowerCase() == 'help') list.push("help");
    if (["about"].indexOf(token) > -1) list.push("about");
    if (["skill", "skillset", "skillsets", "skills", "technology", "tech"].indexOf(token) > -1) list.push("skills");
    if (["experience", "experiences", "workingexperiences", "workingexperience", "workexperiences", "workexperience"].indexOf(token) > -1) list.push("workingExperiences");
}

const ask = () => {
    displayMessage("send", askBox.value);
}

const askOnKeyDown = (event) => {
    if (event.key == "Enter")
        ask();
}

const init = () => {
    candName = document.getElementById("candNameId");
    askBox = document.getElementById("messageTxt");
    messageUl = document.getElementById("message-list");
    displayMessage("reply", "Hi, I am a chat bot, has been programmed to answer certain queries on behalf of Soumyabrata. This bot will be able to tell about his professional experiences, skills etc. There are few examples of queries provided. Similarly you can ask if you are interested to know more about Soumyabrata. Thank You :)");
    displayMessage("reply", "Send 'help' to get some more information");

    fetch('/scripts/data.json')
        .then((response) => response.json())
        .then((json) => {
            localStorage.setItem("data", JSON.stringify(json));
            candName.innerHTML = json[0].name;
            initProject();
        });
}


