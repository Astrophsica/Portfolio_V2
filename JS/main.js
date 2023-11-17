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
        var tagElement = document.createElement("Span")
        tagElement.setAttribute("Class", "badge text-bg-primary")
        tagElement.textContent = project["Tags"][tag]
        clone.querySelector(".card-footer").append(tagElement)
        clone.querySelector(".card-footer").append(" ")
    }
 
    // Add to the year card
    yearCard.append(clone)
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