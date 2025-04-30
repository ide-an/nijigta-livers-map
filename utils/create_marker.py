from PIL import Image, ImageDraw

im = Image.open("../public/img/avatar/kuzuha.png")
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
draw.ellipse((0, 0, size, size),outline="#ACA7BB",width=5)

# 下の方作る
new_image = Image.new("RGBA", [size, size+16], "rgba(0,0,0,0)") # Create a white rgba background
draw = ImageDraw.Draw(new_image)
draw.polygon([(32,77), (54,55),(38,60),(26,60),(9,55),(31,77)], fill="#ACA7BB")
new_image.paste(im, (0, 0), im)    
im = new_image

#draw.ellipse((0, 0, size, size),outline="#FFFFFF",width=5)
# TODO: 形状変えたい、cropしたい
im.save("marker_k.png","PNG")
