/*jshint esversion: 6*/

const userMenu = document.querySelector(".user-menu");
const userImage = document.querySelector("#user-image");

userMenu.style.display = "none";

userImage.addEventListener("click", e => {
    e.preventDefault();

    userMenu.style.display = "block";
});

document.onclick = e => {
    if (e.target.class !== "user-menu" && e.target.id !== "user-image") {
        userMenu.style.display = "none";
    }
};
