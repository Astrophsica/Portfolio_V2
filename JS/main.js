function GetYearCard(year)
{
    return document.getElementById(year + "-cards")
}

function CreateYearCard(year)
{
    const yearsDiv = document.querySelector("#YearsDiv")
    const template = document.querySelector("#YearCardTemplate")
    const clone = template.content.cloneNode(true)
    clone.querySelector("h3").textContent = year
    clone.querySelector("#Cards").setAttribute("id", year + "-cards")
    yearsDiv.append(clone)
}


function CreateProjectCard(yearCard, project, projectId)
{
    const template = document.querySelector("#ProjectCardTemplate")
    const clone = template.content.cloneNode(true)

    var projectId = "Project" + projectId
    
    var carouselInner = clone.querySelector(".carousel-inner")
    var carouselItem = document.createElement("div")
    carouselItem.setAttribute("class", "carousel-item active ratio ratio-16x9")
    for (i in project["Media"]) {
        var img = document.createElement("img")
        img.src = project["Media"][i]
        carouselItem.append(img)
        carouselInner.append(carouselItem)
    }
    clone.querySelector(".carousel").setAttribute("id", projectId)
    clone.querySelector(".carousel-control-prev").setAttribute("data-bs-target", projectId)
    clone.querySelector(".carousel-control-next").setAttribute("data-bs-target", projectId)

    clone.querySelector(".card-title").textContent = project["DisplayName"]
    clone.querySelector(".card-subtitle").textContent = project["Subtitle"]
    clone.querySelector(".card-text").textContent = project["Description"]

    for (var linkKey in project["Links"])
    {
        var linkElement =  document.createElement("a")
        linkElement.setAttribute("href", project["Links"][linkKey])
        linkElement.setAttribute("class", "card-link")
        linkElement.setAttribute("target", "_blank")
        linkElement.textContent = linkKey
        clone.querySelector(".links").append(linkElement)
    }

    for (var tag in project["Tags"])
    {
        var tagElement = document.createElement("Span")
        tagElement.setAttribute("Class", "badge text-bg-primary")
        tagElement.textContent = project["Tags"][tag]
        clone.querySelector(".card-footer").append(tagElement)
    }

    yearCard.append(clone)
}



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

    for (var key2 in project) 
    {
        console.log(key2 + " : " + project[key2])

    } 
}
// How to write inside HTML element
//document.getElementById("ProjectYears").innerHTML