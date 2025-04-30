from PIL import Image, ImageDraw
import json

with open("../app/data/livers.json", encoding="utf-8") as f:
    livers = json.load(f)

for liver in livers:
    liver_id = liver["id"]
    liver_color = liver["color"]
    im = Image.open(f"../public/img/avatar/{liver_id}.png")
    size = 64
# リサイズ
    im = im.resize((size, size))

# 背景色の変更
    new_image = Image.new("RGBA", im.size, "WHITE") # Create a white rgba background
    new_image.paste(im, (0, 0), im)    
    im = new_image

# cropping
    mask = Image.new(mode="L", size=(size, size), color=0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    im.putalpha(mask)

# ボーダー
    draw = ImageDraw.Draw(im)
    draw.ellipse((0, 0, size, size),outline=liver_color,width=5)

# 下の方作る
    new_image = Image.new("RGBA", [size, size+16], "rgba(0,0,0,0)") # Create a white rgba background
    draw = ImageDraw.Draw(new_image)
    draw.polygon([(32,77), (54,55),(38,60),(26,60),(9,55),(31,77)], fill=liver_color)
    new_image.paste(im, (0, 0), im)    
    im = new_image

    fname = f"../public/img/marker/{liver_id}.png"
    im.save(fname,"PNG")
