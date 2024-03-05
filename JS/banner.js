// Banner
const canvas = document.getElementById("banner");
const ctx = canvas.getContext("2d");

var Rendering = false;
var focused = false;
var AnimatedImages = []
var PrevoiusTimeStamp;
var TimeStampOfLastSpawn;
const ImageWidth = 355;
const ImageHeight = 200;

function CreateAnimatedImageObject(imgElement)
{
    return {
    ["ImgElement"] : imgElement,
    ["Running"] : false,
    ["X"] : 0,
    ["Y"] : 0
    }
}



for (var key in ProjectImages)
{
    var animatedImageObject = CreateAnimatedImageObject(ProjectImages[key]);
    AnimatedImages.push(animatedImageObject);
}

function UpdateCanvas(timeStamp) {
    // Process elapsed time
    if (PrevoiusTimeStamp == undefined)
    {
        PrevoiusTimeStamp = timeStamp;
    }

    if (PrevoiusTimeStamp == timeStamp) {
        return
    }

    Rendering = true;
    const deltaTime = timeStamp - PrevoiusTimeStamp;

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = 200
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set background to black
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update moving images
    for (var animatedImageKey in AnimatedImages)
    {
        var animatedImage = AnimatedImages[animatedImageKey];
        if (animatedImage["Running"] == true)
        {
            if (animatedImage["X"] < 0 - ImageWidth)
            {
                animatedImage["Running"] = false;
                continue;
            }
            animatedImage["X"] -= 0.1 * deltaTime;
            ctx.drawImage(animatedImage["ImgElement"], Math.floor(animatedImage["X"]), animatedImage["Y"], ImageWidth, ImageHeight);
            continue;
        }
    }

    // Create new moving images
    if (TimeStampOfLastSpawn == undefined || timeStamp - TimeStampOfLastSpawn > 3475 )
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
        var randomIndex = Math.floor(Math.random() * (nonRunningImages.length - 1));
        animatedImage = nonRunningImages[randomIndex]
        animatedImage["X"] = Math.floor(canvas.width);
        animatedImage["Running"] = true;
        TimeStampOfLastSpawn = timeStamp;
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

    Rendering = false;
}


window.onload = function(){
    function RunAnimateFrame()
    {
        if (Rendering == false)
        {
            requestAnimationFrame(UpdateCanvas)
        }
    }
    setInterval(RunAnimateFrame, 16)
}