const menu = document.getElementById("menu");

export function getMenuButtons() {
    return Array.from(menu.querySelectorAll(".menu-item"));
}

function resetActiveMenuButtons() {
    getMenuButtons().forEach((button) => {
        button.toggleAttribute("active", false);
    });
}

/**
 * @param {Event} event
 */
function onMenuButtonClick(event) {
    const button = event.target;
    const id = button.id;

    resetActiveMenuButtons();
    button.toggleAttribute("active", true);
    localStorage.setItem("section", id);
}

export function initMenuButtons() {
    getMenuButtons().forEach((button) => {
        button.addEventListener("click", onMenuButtonClick);
    });

    const section = localStorage.getItem("section");
    if (section) {
        const button = document.querySelector(`.menu-item#${section}`);
        if (button) {
            button.click();
        }
    } else {
        getMenuButtons()[0].click();
    }
}
