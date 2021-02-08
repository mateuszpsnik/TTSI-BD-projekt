/*jshint esversion:6*/

const rightPanel = document.querySelector("#right-panel");

const rightPanelCollapsed = document.querySelector("#right-panel-collapsed");

const rightCloseButton = document.querySelector("#right-close-button");

const rightOpenButton = document.querySelector("#right-open-button");

const mainContent = document.querySelector("#main");


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
        }
    }, 1);

    mainContent.style.marginRight = initialPosition - 1300  + "px";
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
        }
    }, 1);

    mainContent.style.marginRight = initialPosition - 1300 + "px";
});