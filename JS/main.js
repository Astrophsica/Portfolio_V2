function GetYearCard(year)
{
    return document.getElementById(year + "-cards")
}

function CreateYearCard(year)
{
    // Get template and clone
    const yearsDiv = document.querySelector("#YearsDiv")
    const template = document.querySelector("#YearCardTemplate")
    const clone = template.content.cloneNode(true)

    // Set year and card Id
    clone.querySelector("h3").textContent = year
    clone.querySelector("#Cards").setAttribute("id", year + "-cards")

    // Add to years div
    yearsDiv.append(clone)
}


function CreateProjectCard(yearCard, project, projectId)
{
    // Get template and clone
    const template = document.querySelector("#ProjectCardTemplate")
    const clone = template.content.cloneNode(true)

    // Create project unique ID (Used for carousel)
    var projectId = "Project" + projectId

    // Get carousel and add media
    var carouselInner = clone.querySelector(".carousel-inner")
    for (i in project["Media"]) {
        var carouselItem = document.createElement("div")
        if (i == 0)
        {
            carouselItem.setAttribute("class", "carousel-item ratio active ratio-16x9") 
        }
        else
        {
            carouselItem.setAttribute("class", "carousel-item ratio ratio-16x9") 
        }
        var img = document.createElement("img")
        img.src = project["Media"][i]
        carouselItem.append(img)
        carouselInner.append(carouselItem)
    }

    // Set up carousel unique ID
    clone.querySelector(".carousel").setAttribute("id", projectId)
    clone.querySelector(".carousel-control-prev").setAttribute("data-bs-target", "#" + projectId)
    clone.querySelector(".carousel-control-next").setAttribute("data-bs-target", "#" + projectId)

    // Set title, subtitle and description
    clone.querySelector(".card-title").textContent = project["DisplayName"]
    clone.querySelector(".card-subtitle").textContent = project["Subtitle"]
    clone.querySelector(".card-text").textContent = project["Description"]

    // Set links
    for (var linkKey in project["Links"])
    {
        var linkElement =  document.createElement("a")
        linkElement.setAttribute("href", project["Links"][linkKey])
        linkElement.setAttribute("class", "card-link")
        linkElement.setAttribute("target", "_blank")
        linkElement.textContent = linkKey
        clone.querySelector(".links").append(linkElement)
    }

    // Set tags
    for (var tag in project["Tags"])
    {
        var tagName = project["Tags"][tag]
        var tagType = Tags[tagName]["Type"]
        var tagElement = document.createElement("span")
        tagElement.setAttribute("Class", "badge text-bg-" + tagType)
        tagElement.textContent = tagName
        clone.querySelector(".card-footer").append(tagElement)
        clone.querySelector(".card-footer").append(" ")
    }
 
    // Add to the year card
    yearCard.append(clone)
}


function OnTagButtonClick(buttonElement)
{
    console.log(buttonElement.textContent)
    var tagName = buttonElement.textContent

    Tags[tagName]["Enabled"] = !Tags[tagName]["Enabled"]
    var tagsSection = document.getElementById("Tags")
    var buttons = tagsSection.querySelectorAll("button")
    for (var i = 0; i < buttons.length; i++)
    {
        if (buttons[i].textContent == tagName)
        {
            if (Tags[tagName]["Enabled"] == true)
            {
                buttons[i].setAttribute("Class", "m-1 btn btn-sm btn-" + Tags[tagName]["Type"])
            }
            else
            {
                buttons[i].setAttribute("class", "m-1 btn btn-sm btn-outline-" + Tags[tagName]["Type"])
            }
            break
        }
    }

    var filterActive = false
    for (var tagName in Tags)
    {
        if (Tags[tagName]["Enabled"] == true)
        {
            filterActive = true
            break
        }
    }

    var projectCards = document.getElementsByClassName("project")
    for (var projectIndex = 0; projectIndex < projectCards.length; projectIndex++)
    {
        projectElement = projectCards[projectIndex]
        showProject = true

        if (filterActive)
        {
            var showProject = false
            var badges = projectElement.querySelectorAll(".badge")
            for (var badgeIndex = 0; badgeIndex < badges.length; badgeIndex++)
            {
                var badge = badges[badgeIndex]
                if (Tags[badge.textContent]["Enabled"] == true)
                {
                    showProject = true
                }
            }
        }


        if (showProject == false)
        {
            projectElement.setAttribute("Class", "col project hidden")
        }
        else
        {
            projectElement.setAttribute("Class", "col project")
        }
    }
}


// Initialise
var projectId = 0
for (var key in Projects) {
    projectId++
    var project = Projects[key]
    var year = project["Year"]
    var yearCard = GetYearCard(year)

    if (yearCard == null)
    {
        CreateYearCard(year)
        yearCard = GetYearCard(year)
    }
    
    CreateProjectCard(yearCard, project, projectId)
}

var tagsSection = document.getElementById("Tags")
for (var tagKey in Tags)
{
    var buttonElement = document.createElement("button")
    buttonElement.setAttribute("type", "button")
    buttonElement.setAttribute("class", "m-1 btn btn-sm btn-outline-" + Tags[tagKey]["Type"])
    buttonElement.setAttribute("onclick", "OnTagButtonClick(this)")
    buttonElement.textContent = tagKey
    tagsSection.appendChild(buttonElement)
}

