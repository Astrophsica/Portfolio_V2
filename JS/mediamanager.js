import { Media } from "./media.js";

function LodLoadMedia(mediaRef)
{
    var mediaList = Media[mediaRef];
    if (mediaList == null)
    {
        console.error(mediaRef + " does not exist in media.js");
        return
    }

    var visibleImg = new Image()
    var lod = 0

    function LoadImg(lod)
    {
        var img = new Image()
        img.src = mediaList[lod]
        if (lod > 0)
        {
            img.decode = "async"
        }
        img.onload = function() {
            visibleImg.src = img.src
            if (mediaList.length - 1 != lod)
            {
                LoadImg(lod + 1)
            }
        }
    }

    LoadImg(lod)

    return visibleImg
}

export {LodLoadMedia}
