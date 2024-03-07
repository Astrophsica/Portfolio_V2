import { Projects } from "./projects"
import { LodLoadMedia } from "../mediamanager"
import { Tags } from "./tags"

var ProjectImages = []

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
        var img = LodLoadMedia(project["Media"][i])
        ProjectImages.push(img)
        carouselItem.append(img)
        carouselInner.append(carouselItem)

        if (project["Media"].length == 1)
        {
            clone.querySelector(".carousel-control-prev").classList.add("hidden")
            clone.querySelector(".carousel-control-next").classList.add("hidden")
        }
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

        var imgElement = LodLoadMedia(Icons[linkKey])
        imgElement.setAttribute("alt", linkKey)
        imgElement.setAttribute("class", "icon")
        linkElement.append(imgElement)

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

    // Toggle tag enabled
    Tags[tagName]["Enabled"] = !Tags[tagName]["Enabled"]

    // Find button for tag and set it to show if toggled or not
    var tagsSection = document.getElementById("Tags")
    var buttons = tagsSection.querySelectorAll("button")
    for (var i = 0; i < buttons.length; i++)
    {
        if (buttons[i].textContent == tagName)
        {
            if (Tags[tagName]["Enabled"] == true)
            {
                buttons[i].classList.replace("btn-outline-" + Tags[tagName]["Type"], "btn-" + Tags[tagName]["Type"])
            }
            else
            {
                buttons[i].classList.replace("btn-" + Tags[tagName]["Type"], "btn-outline-" + Tags[tagName]["Type"])
            }
            break
        }
    }

    // Check if any tags are enabled. If not, then show all project cards
    var filterActive = false
    for (var tagName in Tags)
    {
        if (Tags[tagName]["Enabled"] == true)
        {
            filterActive = true
            break
        }
    }

    // Set project to show or hide based on toggled tags (or show all if no tag enabled)
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
            projectElement.classList.toggle("hidden", true)
        }
        else
        {
            projectElement.classList.toggle("hidden", false)
        }
    }

    // Hide year if all projects in that year is hidden
    var yearCards = document.getElementsByClassName("year")
    for (var yearIndex = 0; yearIndex < yearCards.length; yearIndex++)
    {
        var yearElement = yearCards[yearIndex]
        var hiddenCards = yearElement.querySelectorAll(".hidden")
        var cards = yearElement.querySelectorAll(".project")
        
        if (hiddenCards.length == cards.length)
        {
            yearElement.classList.toggle("hidden", true)
        }
        else
        {
            yearElement.classList.toggle("hidden", false)
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

// Create filter tags
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









