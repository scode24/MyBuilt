
let projectIndex = 0;
let isSmallScrSearchDialogOpen = false;
let searchByList = ["Search by"];

const search = (screenSize) => {
    if (screenSize == "mid-scr") {
        let searchValue = document.getElementById("searchTxt").value;
        let searchBy = document.getElementById("searchBy").value;

        if (searchBy == "search-by" || searchValue == "" || searchValue == null)
            alert("Please select search by and provide search value");

        processSearch(searchBy, searchValue);
    } else if (screenSize == "small-scr") {
        let smallScrSearchValue = document.getElementById("smallScrSearchTxt").value;
        let smallScrSearchBy = document.getElementById("smallScrSearchBy").value;

        if (smallScrSearchBy == "search-by" || smallScrSearchValue == "" || smallScrSearchValue == null)
            alert("Please select search by and provide search value");

        processSearch(smallScrSearchBy, smallScrSearchValue);
    }
}

const clearSearch = (screenSize) => {
    let searchBy = null;
    let searchValue = null;
    if (screenSize == "mid-scr-clear") {
        searchValue = document.getElementById("searchTxt");
        searchBy = document.getElementById("searchBy");
    } else if (screenSize == "small-scr-clear") {
        searchValue = document.getElementById("smallScrSearchTxt");
        searchBy = document.getElementById("smallScrSearchBy");
    }

    searchValue.innerHTML = "";
    initProject();
}

const processSearch = (searchBy, searchValue) => {
    let foundList = [];
    const data = JSON.parse(localStorage.getItem("data"));
    const projectList = data[0]["projects"];
    projectList.forEach(project => {
        const existingValue = project[searchBy].toLowerCase();
        searchValue = searchValue.toLowerCase();
        if (existingValue.includes(searchValue))
            foundList.push(project);
    });

    populateProjectList(foundList);
}

const searchOnKeyDown = (event) => {
    if (event.key == "Enter")
        search();
}

const searchOnInput = () => {
    let searchDialog = document.getElementById("small-scr-search");
    if (isSmallScrSearchDialogOpen)
        searchDialog.style.display = "none";
    else {
        searchDialog.style.display = "flex";
        populateSearchBy("smallScrSearchBy");
    }

    isSmallScrSearchDialogOpen = !isSmallScrSearchDialogOpen;
}

const toggleView = (view) => {
    let chatOpt = document.getElementById("chatOpt");
    let projectOpt = document.getElementById("projectOpt");
    let leftPanel = document.getElementById("left");
    let rightPanel = document.getElementById("right");

    if (view == "project") {
        chatOpt.style.display = "flex";
        projectOpt.style.display = "none";
        leftPanel.style.display = "none";
        rightPanel.style.display = "block";
    }

    if (view == "chat") {
        chatOpt.style.display = "none";
        projectOpt.style.display = "flex";
        leftPanel.style.display = "block";
        rightPanel.style.display = "none";
    }
}

const changeImage = (index) => {
    const data = JSON.parse(localStorage.getItem("data"));
    const projectList = data[0]["projects"];
    const imgFolder = projectList[index]["img-folder"];
    const noOfImages = projectList[index]["no-of-img"];
    const img = document.getElementById(imgFolder + "-img");
    const srcPath = img.getAttribute("src").split("/");
    const fileName = srcPath[srcPath.length - 1].split(".")[0];

    let newImageName = "1.png";
    if (parseInt(fileName) + 1 <= noOfImages)
        newImageName = (parseInt(fileName) + 1) + ".png";

    img.setAttribute("src", "./assets/projects/" + imgFolder + "/" + newImageName);
}

const openGitLink = (index) => {
    const data = JSON.parse(localStorage.getItem("data"));
    const projectList = data[0]["projects"];
    const githubUrls = projectList[index]["github-link"].split(",");

    githubUrls.forEach(link => {
        window.open(link);
    });
}

const populateSearchBy = (searchBySelectId) => {
    const data = JSON.parse(localStorage.getItem("data"));
    const projectList = data[0]["projects"];
    let searchBy = document.getElementById(searchBySelectId);
    searchBy.innerHTML = "";

    let searchOption = document.createElement("option");
    searchOption.setAttribute("value", "search-by");
    searchOption.innerText = "Search by";
    searchBy.appendChild(searchOption);

    if (projectList.length > 0) {
        for (const [key, value] of Object.entries(projectList[0])) {
            searchOption = document.createElement("option");
            searchOption.setAttribute("value", key);
            searchOption.innerText = key;
            searchBy.appendChild(searchOption);
        }
    }
}

const populateProjectList = (projectList) => {
    let projectUl = document.getElementById("project-list");
    projectUl.innerHTML = "";
    projectList.forEach(project => {
        let li = document.createElement("li");
        let imgSrc = "";
        let imgTag = "";
        let techList = project.technology.split(",");

        let techStackDivContainer = "<div class='tech-stack-container'>";
        let stack = ""

        if (project["type"] == "Personal project") {
            stack += "<div class='tech-stack-primary' onclick='openGitLink(" + projectIndex + ")'>GitHub</div>";
        }

        techList.forEach(tech => {
            stack += "<div class='tech-stack'>" + tech + "</div>";
        });
        techStackDivContainer += stack + "</div>";

        if (project["img-folder"] != "") {
            imgSrc = "./assets/projects/" + project["img-folder"];
            imgTag = "<img id='" + project["img-folder"] + "-img" + "' src = '" + imgSrc + "/1.png' alt = 'project image'  onclick='changeImage(" + projectIndex + ")'/><span class='clickText'>Click on images to change image</span>";
        }
        li.innerHTML = "<div class='project-box'><div class='slides'>" + imgTag + "</div><div class='description'><strong>" + project.name + " : </strong>" + project.description + "</div>" + techStackDivContainer + "</div>";

        projectUl.appendChild(li);
        projectIndex++;
    });
}

const initProject = () => {
    const data = JSON.parse(localStorage.getItem("data"));
    let projectList = data[0]["projects"];
    populateProjectList(projectList);
    populateSearchBy("searchBy");
}