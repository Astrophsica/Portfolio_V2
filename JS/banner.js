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
var canvasId = 0
var ActiveGifs = []

async function UpdateImageOnSrcChange(imgElement, canvasCtx, canvas, canvasId)
{
    var observer = new MutationObserver((changes) => {
        changes.forEach(change => {
            if(change.attributeName.includes('src')){
                if (imgElement.src == "")
                {
                    return
                }
                let fileType = imgElement.src.split('.').pop();

                if (fileType == "gif")
                {


                    var gif = gifler(imgElement.src)
                    var animatorPromise = gif.animate(canvas)

                    function ProcessAnimatorPromise(animatorPromise, canvasId)
                    {
                        animatorPromise.then(function(animator)
                        {
                            for (var i; i < ActiveGifs.length; i++)
                            {
                                if (i == ActiveGifs[i].CanvasId)
                                {
                                    ActiveGifs[i].Animator.stop()
                                    ActiveGifs.splice(i, 1)
                                }
                            }
                            
                            ActiveGifs.push({
                                CanvasId: canvasId,
                                Animator: animator
                            })
                        })
                    }

                    ProcessAnimatorPromise(animatorPromise, canvasId)
                    return
                }
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
    UpdateImageOnSrcChange(imgElement, newCanvasCtx, newCanvas, canvasId)
    canvasId += 1
    return newCanvas
}

function CreateAnimatedImageObject(imgElement)
{
    return {
    ["ImgElement"] : imgElement,
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
    if (ScrollingCanvasX < -ImageWidth - 50)
    {
        ScrollingCanvasX = -ImageWidth
    }

    var runningImgIndex = 0
    while (RunningImages.length > runningImgIndex)
    {
        let imageObject = RunningImages[runningImgIndex];
        
        // Check if image is not visible (left side)
        if ((runningImgIndex * ImageWidth) + ScrollingCanvasX <= 0 - ImageWidth)
        {
            RunningImages.shift();
            ScrollingCanvasX = ScrollingCanvasX + ImageWidth;
            continue
        }

        // Check if image is not visible (right side)
        if((runningImgIndex * ImageWidth) + ScrollingCanvasX > canvas.width)
        {
            RunningImages.splice(runningImgIndex)
            break;
        }

        ctx.drawImage(imageObject["OffscreenCanvas"], (runningImgIndex * ImageWidth) + ScrollingCanvasX, 0)
        runningImgIndex += 1
    }


    // Add new running images
    if ((RunningImages.length * ImageWidth) + ScrollingCanvasX < canvas.width)
    {
        function filterToNotRunning(imageToFilter)
        {
            if (RunningImages.includes(imageToFilter))
            {
                return false
            }
            return true
        }
        var nonRunningImages = AnimatedImages.filter(filterToNotRunning)


        while ((RunningImages.length * ImageWidth) + ScrollingCanvasX < canvas.width)
        {
            let randomIndex = Math.floor(Math.random() * (nonRunningImages.length - 1));
            let selectedImageObject = nonRunningImages[randomIndex]

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