function main() {
    const nav = document.querySelector("#nav-bar");
    fetch("common/nav.html")
        .then((res) => res.text())
        .then((html) => {
            nav.innerHTML = html;
        })
        .then(() => {
            const anchors = document.querySelectorAll("#nav-items a");
            for (const anchor of anchors) {
                if (anchor.href == window.location) {
                    console.log("ok");
                    anchor.classList.toggle("current-link")
                    break;
                }
            }

            const toggleNav = document.querySelector("#toggle-nav");
            toggleNav.addEventListener("click", () => {
                nav.classList.toggle("visible");
                toggleNav.classList.toggle("visible");
            });
        });   
}

main();