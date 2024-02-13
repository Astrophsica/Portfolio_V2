// Banner
const canvas = document.getElementById("banner");
const ctx = canvas.getContext("2d");

function CreateAnimatedImageObject(imgElement)
{
    return {
    ["ImgElement"] : imgElement,
    ["Running"] : false,
    ["X"] : 0,
    ["Y"] : 3
    }
}

var AnimatedImages = []
var RunningImages = [];
var currentRow = -1
var prevoiusTimeStamp;
var timeStampOfLastSpawn;
const imageWidth = 355;
const imageHeight = 200;

for (var key in ProjectImages)
{
    var animatedImageObject = CreateAnimatedImageObject(ProjectImages[key]);
    AnimatedImages.push(animatedImageObject);
}

function UpdateCanvas(timeStamp) {
    // Process elapsed time
    if (prevoiusTimeStamp == undefined)
    {
        prevoiusTimeStamp = timeStamp;
    }

    if (prevoiusTimeStamp == timeStamp) {
        requestAnimationFrame(UpdateCanvas);
    }

    const deltaTime = timeStamp - prevoiusTimeStamp;

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
        // Update existing images
        if (animatedImage["Running"] == true)
        {
            if (animatedImage["X"] < 0 - imageWidth)
            {
                animatedImage["Running"] = false;
                continue;
            }
            animatedImage["X"] -= 0.1 * deltaTime;
            ctx.drawImage(animatedImage["ImgElement"], Math.floor(animatedImage["X"]), animatedImage["Y"], imageWidth, imageHeight);
            continue;
        }
    }

    // Create new moving images
    if (timeStampOfLastSpawn == undefined || timeStamp - timeStampOfLastSpawn > 3475 )
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
        if (currentRow == 2)
        {
            animatedImage["X"] = Math.floor(canvas.width - (imageWidth / 2));
        }
        
        animatedImage["Running"] = true;
        timeStampOfLastSpawn = timeStamp;
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

    prevoiusTimeStamp = timeStamp;
}

window.onload = function(){
    function RunAnimateFrame()
    {
        requestAnimationFrame(UpdateCanvas)
    }
    setInterval(RunAnimateFrame, 10)
}