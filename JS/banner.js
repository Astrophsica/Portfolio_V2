import { Projects } from "./Projects/projects.js";
import { LodLoadMedia } from "./mediamanager.js";

// Banner
const canvas = document.getElementById("banner");
const ctx = canvas.getContext("2d");

var focused = false;
var AnimatedImages = []
var PrevoiusTimeStamp;
var TimeStampOfLastSpawn;
const ImageWidth = 355;
const ImageHeight = 200;
var ScrollingCanvasX = 0;
var RunningImages = [];


async function UpdateImageOnSrcChange(imgElement, canvasCtx)
{
    var observer = new MutationObserver((changes) => {
        changes.forEach(change => {
            if(change.attributeName.includes('src')){
                canvasCtx.drawImage(imgElement, 0, 0, ImageWidth, ImageHeight);
            }
        });
      });
    observer.observe(img, {attributes : true});
}



function CreateOffscreenCanvas(imgElement)
{
    let newCanvas = new OffscreenCanvas(ImageWidth, ImageHeight)
    const newCanvasCtx = newCanvas.getContext("2d");

    newCanvasCtx.drawImage(imgElement, 0, 0, ImageWidth, ImageHeight)
    UpdateImageOnSrcChange(imgElement, newCanvasCtx)
    return newCanvas
}

function CreateAnimatedImageObject(imgElement)
{
    return {
    ["ImgElement"] : imgElement,
    ["Running"] : false,
    ["OffscreenCanvas"] : CreateOffscreenCanvas(imgElement)
    }
}



for (var a in Projects)
{
    for (var b in Projects[a]["MediaRef"])
    {
        var img = LodLoadMedia(Projects[a]["MediaRef"][b])
        var animatedImageObject = CreateAnimatedImageObject(img);
        AnimatedImages.push(animatedImageObject);
    }
}


function UpdateCanvas(timeStamp) {
    // Process elapsed time
    if (PrevoiusTimeStamp == undefined)
    {
        PrevoiusTimeStamp = timeStamp;
    }

    if (PrevoiusTimeStamp == timeStamp) {
        setTimeout(requestAnimationFrame(UpdateCanvas), 10)
        return
    }
    const deltaTime = timeStamp - PrevoiusTimeStamp;

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = 200
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set background to black
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    // Update existing images
    ScrollingCanvasX -= 0.1 * deltaTime
    
    for (let i = 0; i < RunningImages.length; i++) 
    { 
        let imageObject = RunningImages[i];
        
        // Check if image is not visible (left side)
        if ((i * ImageWidth) + ScrollingCanvasX < 0 - ImageWidth)
        {
            imageObject["Running"] = false;
            RunningImages.shift();
            ScrollingCanvasX = ScrollingCanvasX + ImageWidth;
            imageObject = RunningImages[i];
        }

        // Check if image is not visible (right side)
        if((i * ImageWidth) + ScrollingCanvasX > canvas.width)
        {
            imageObject["Running"] = false;
            RunningImages.splice(i)
            break;
        }

        if (imageObject == null)
        {
            break;
        }

        ctx.drawImage(imageObject["OffscreenCanvas"], (i * ImageWidth) + ScrollingCanvasX, 0)
    }


    // Add new running images
    if ((RunningImages.length * ImageWidth) + ScrollingCanvasX < canvas.width)
    {
        function filterToNotRunning(imageToFilter)
        {
            if (imageToFilter["Running"] == false)
            {
                return true;
            }
            return false;
        }
        var nonRunningImages = AnimatedImages.filter(filterToNotRunning)


        while ((RunningImages.length * ImageWidth) + ScrollingCanvasX < canvas.width)
        {
            let randomIndex = Math.floor(Math.random() * (nonRunningImages.length - 1));
            let selectedImageObject = nonRunningImages[randomIndex]
            selectedImageObject["Running"] = true;

            nonRunningImages.splice(randomIndex, 1);
            RunningImages.push(selectedImageObject);

            ctx.drawImage(selectedImageObject["OffscreenCanvas"], (RunningImages.length - 1 * ImageWidth) + ScrollingCanvasX, 0)
        }
    }


    // Set overlay to semi transparent black
    ctx.fillStyle = "black";
    ctx.filter = "opacity(50%)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.filter = "none";

    // Create title text
    var textFontSize = 75
    ctx.fillStyle = "white"
    ctx.font = textFontSize.toString() + "px Ubuntu"
    const text = "AstrophsicaDev"
    var textActualSize = ctx.measureText(text)

        // If text wont fit screen, shrink font size
    if (canvas.width < textActualSize.width)
    {
        var percentageToShrink = canvas.width / textActualSize.width
        textFontSize = Math.floor(textFontSize * percentageToShrink) 
        ctx.font = textFontSize.toString() + "px Ubuntu"
        textActualSize = ctx.measureText(text)
    }

    ctx.fillText(text, (canvas.width / 2) - textActualSize.width / 2, (canvas.height / 2) + textActualSize.emHeightAscent / 2)

    PrevoiusTimeStamp = timeStamp;
    requestAnimationFrame(UpdateCanvas);
}



requestAnimationFrame(UpdateCanvas)