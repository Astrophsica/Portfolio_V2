import { LodLoadMedia } from "../mediamanager.js"

const apiUrl = "https://api.astrophsicadev.com/courses"
const coursesCard = document.querySelector("#Cards")

function CreateCourseCard(courseData)
{
    console.log(courseData)

        // Get template and clone
        const template = document.querySelector("#CourseCardTemplate")
        const clone = template.content.cloneNode(true)

        clone.querySelector(".card-title").textContent = courseData["course_header"]
        clone.querySelector(".card-subtitle").textContent = courseData["dates_card"]
        clone.querySelector(".card-text").textContent = courseData["brief_description"]

        coursesCard.append(clone)
}

function ProcessCoursesData(coursesData)
{
    for (var courseIndex = 0; courseIndex < coursesData.length; courseIndex++)
    {
        CreateCourseCard(coursesData[courseIndex])
    }
}


// Initialise
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error("An error has occured")
        }
        return response.json();
    })
    .then(data => {
        ProcessCoursesData(data)
    })








