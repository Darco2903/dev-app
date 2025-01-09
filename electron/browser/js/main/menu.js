const menu = document.getElementById("menu");

/**
 * @returns {HTMLDivElement[]}
 */
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

function onMenuToggle(event) {
    const button = event.target;
    const id = button.dataset.toggle;
    window.dispatchEvent(
        new CustomEvent("toggle", {
            detail: {
                button,
                id,
            },
        })
    );
}

export function initMenuButtons() {
    getMenuButtons().forEach((button) => {
        const fn = button.classList.contains("toggle") ? onMenuToggle : onMenuButtonClick;
        button.addEventListener("click", fn);
    });

    const section = localStorage.getItem("section");
    if (section) {
        const button = document.querySelector(`.menu-item#${section}`);
        if (button) {
            button.click();
        }
    } else {
        getMenuButtons()
            .find((button) => !button.className.includes("toggle"))
            .click();
    }
}
