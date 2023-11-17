var YearCards = {}

function GetYearCard(year)
{
    return YearCards[year]
}

function CreateYearCard(year)
{
    var count = 0
    for (var years in YearCards)
    {
        count++
    }

    if (count == 0)
    {
        const yearsDiv = document.querySelector("#YearsDiv")
        const template = document.querySelector("#YearCardTemplate")
        const clone = template.content.cloneNode(true)
        clone.querySelector("h3").textContent = year
        yearsDiv.append(clone)
        YearCards[year] = clone
        console.log(YearCards[year])
    }
}

for (var key in Projects) {
    var project = Projects[key]
    var year = project["Year"]
    var yearCard = GetYearCard(year)

    if (yearCard == null)
    {
        CreateYearCard(year)
    }
    
    
    for (var key2 in project) 
    {
        console.log(key2 + " : " + project[key2])

    } 
}
// How to write inside HTML element
//document.getElementById("ProjectYears").innerHTML