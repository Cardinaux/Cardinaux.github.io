import { jsonChecks } from "../external/jsonChecks/jsonChecks.js";

class Project {
    constructor(name, link, descItems) {
        this.name = name;
        this.link = link;
        this.descItems = descItems;
    }

    static fromJson(json) {
        jsonChecks(json)
            .isObject()
            .keyIsString("name")
            .keyIsString("link")
            .keyIsArray("desc")
            .checkOrExcept();

        return new Project(
            json["name"],
            json["link"],
            json["desc"].map((jsonDescItem) => DescItem.fromJson(jsonDescItem))
        );
    }

    asNode() {
        const div = document.createElement("div");
        div.className = "project";

        // Push title
        const titleLink = document.createElement("a");
        titleLink.href = this.link;
        titleLink.target = "blank_"; // make it open in a new tab
        titleLink.rel = "noreferrer noopener"; // i dont imagine github will start phishing anytime soon, but oh well
        div.appendChild(titleLink);
        
        const header = document.createElement("h3");
        header.innerText = this.name;
        header.className = "title";
        titleLink.appendChild(header);

        // Push description items
        this.descItems.forEach((descItem) => div.appendChild(descItem.asNode()));
        
        // Push footer
        const footer = document.createElement("div");
        footer.className = "footer";
        div.appendChild(footer);

        const img = document.createElement("img");
        img.src = "images/github-mark-white.png";
        img.alt = "github icon"
        footer.appendChild(img);

        const footerLink = titleLink.cloneNode(false);
        footerLink.innerText = `${this.name} on GitHub`;
        footer.appendChild(footerLink);
        
        return div;
    }
}

class DescItem {
    constructor(type, content) {
        this.type = type;
        this.content = content;
    }

    static fromJson(json) {
        jsonChecks(json)
            .isObject()
            .keyIsString("type")
            .keyIsArray("content")
            .checkOrExcept();
        
        return new DescItem(
            json["type"],
            json["content"]
        );
    }

    asNode() {
        const div = document.createElement("div");
        
        switch (this.type) {
            case "p":
                this.content.forEach((contentLine) => {
                    const p = document.createElement("p");
                    p.innerText = contentLine;
                    div.appendChild(p);
                });
                break;
            
            case "ul":
            case "ol":
                const l = document.createElement(this.type);
                this.content.forEach((contentLine) => {
                    const li = document.createElement("li");
                    li.innerText = contentLine;
                    l.appendChild(li);
                });
                div.appendChild(l);
                break;
        }

        return div;
    }
}

function populateProjectContainers() {
    const container = document.querySelector("#project-container");
    fetch("json/projects.json")
        .then((res) => res.json())
        .then((json) => {
            if (!jsonChecks(json).isArray().check()) {
                throw new Error("Expected array.");
            }

            json.forEach((jsonProject) => {
                const project = Project.fromJson(jsonProject);
                container.appendChild(project.asNode());
            });
        })
}

populateProjectContainers();