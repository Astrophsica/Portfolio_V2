import { LodLoadMedia } from "../mediamanager.js"

const apiUrl = "https://api.astrophsicadev.com/courses"

function CreateCoursesCard(courseJson)
{

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
        console.log(JSON.stringify(data, null, 2))
    })








