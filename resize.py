from PIL import Image
import PIL
import os
import sys
from PIL import Image, ImageDraw, ImageFont

location = sys.argv[1]
file_name = os.listdir(f"image/{location}")


for image in file_name:
    mywidth = 800
    img = Image.open(f"image/{location}/{image}")
    wpercent = (mywidth/float(img.size[0]))
    hsize = int((float(img.size[1])*float(wpercent)))
    img = img.resize((mywidth, hsize), PIL.Image.ANTIALIAS)
    width, height = img.size
    draw = ImageDraw.Draw(img)
    text = """Nithin K Joy
    180928  """
    font = ImageFont.truetype('arial.ttf', 36)
    textwidth, textheight = draw.textsize(text, font)
    margin = 10
    x = width - textwidth - margin
    y = height - textheight - margin
    draw.text((x, y), text,fill=(255,0,0), font=font)
    img.save(f"image/{location}/{image}")
print("done")
