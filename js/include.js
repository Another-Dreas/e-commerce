function initDarkMode() {
    console.log("initDarkMode called");
    const html = document.documentElement;
    const toggle = document.getElementById("themeToggle");
    const icon = toggle ? toggle.querySelector("i") : null;

    console.log("toggle element:", toggle);
    console.log("icon element:", icon);

    const savedTheme = localStorage.getItem("theme");
    console.log("savedTheme:", savedTheme);
    if (savedTheme === "dark") {
        html.classList.add("dark");
        console.log("Added dark class from localStorage");
    }

    if (toggle && icon) {
        console.log("Setting up dark mode toggle");
        // Set initial icon based on current state
        if (html.classList.contains("dark")) {
            icon.className = "fas fa-sun";
            console.log("Set initial icon to sun");
        } else {
            icon.className = "fas fa-moon";
            console.log("Set initial icon to moon");
        }

        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);

        newToggle.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Toggle clicked - event fired");
            html.classList.toggle("dark");
            const isDark = html.classList.contains("dark");
            console.log("isDark:", isDark);
            const newIcon = newToggle.querySelector("i");
            if (newIcon) {
                if (isDark) {
                    newIcon.className = "fas fa-sun";
                    console.log("Changed icon to sun");
                } else {
                    newIcon.className = "fas fa-moon";
                    console.log("Changed icon to moon");
                }
            }
            localStorage.setItem("theme", isDark ? "dark" : "light");
            console.log("Dark mode toggled:", isDark);
        });
        console.log("Event listener added to cloned element");
    } else {
        console.log("Theme toggle or icon not found - toggle:", !!toggle, "icon:", !!icon);
    }
}

function includeHTML() {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("include-html");
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        elmnt.innerHTML = this.responseText;
                    }
                    if (this.status == 404) {
                        elmnt.innerHTML = "Page not found.";
                    }
                    elmnt.removeAttribute("include-html");
                    includeHTML();
                    initNavbarScroll();
                    initDarkMode(); 
                }
            }
            xhttp.open("GET", file, false); 
            xhttp.send();
            return;
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        includeHTML();
    });
} else {
    includeHTML();
}
