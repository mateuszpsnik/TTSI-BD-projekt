/*jshint esversion:6*/

const leftPanel = document.querySelector("#left-panel");
const rightPanel = document.querySelector("#right-panel");

const leftPanelCollapsed = document.querySelector("#left-panel-collapsed");
const rightPanelCollapsed = document.querySelector("#right-panel-collapsed");

const leftCloseButton = document.querySelector("#left-close-button");
const rightCloseButton = document.querySelector("#right-close-button");

const leftOpenButton = document.querySelector("#left-open-button");
const rightOpenButton = document.querySelector("#right-open-button");

const mainContent = document.querySelector("#main");

leftCloseButton.addEventListener("click", e => {
    let position = leftPanel.offsetLeft;
    let id = setInterval(() => {
        if (position == -200)
            clearInterval(id);
        else {
            position -= 2;
            leftPanel.style.left = position + "px";
            mainContent.style.marginLeft = 200 + position + "px";
        }
    }, 1);
});

rightCloseButton.addEventListener("click", e => {
    const initialPosition = rightPanel.offsetLeft;
    let position = rightPanel.offsetLeft;

    console.log(position);
    let id = setInterval(() => {
        if (position == initialPosition + 200)
            clearInterval(id);
        else {
            position += 2;
            rightPanel.style.left = position + "px";
            mainContent.style.marginRight = initialPosition + 200 - position + "px";
        }
    }, 1);
});

leftOpenButton.addEventListener("click", e => {
    let position = leftPanel.offsetLeft;
    let id = setInterval(() => {
        if (position == 0)
            clearInterval(id);
        else {
            position += 2;
            leftPanel.style.left = position + "px";
            mainContent.style.marginLeft = 200 + position + "px";
        }
    }, 1);
});

rightOpenButton.addEventListener("click", e => {
    const initialPosition = rightPanel.offsetLeft;
    let position = rightPanel.offsetLeft;

    console.log(position);
    let id = setInterval(() => {
        if (position == initialPosition - 200)
            clearInterval(id);
        else {
            position -= 2;
            rightPanel.style.left = position + "px";
            mainContent.style.marginRight = initialPosition - position + "px";
        }
    }, 1);
});