import { Media } from "./media";

function LodLoadMedia(mediaRef)
{
    var mediaList = Media[mediaRef];
    if (mediaList == null)
    {
        console.error(mediaRef + " does not exist in media.js");
        return
    }

    var visibleImg = new Image()
    var currentLod = 0
    for (i in mediaList) {
        var img = new Image()
        img.src = mediaList[i]
        img.onload = function() {
            if (currentLod <= i)
            {
                visibleImg.src = mediaList[i]
                currentLod = i
            }
        }
    }

    return visibleImg
}

export {LodLoadMedia}
