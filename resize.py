import PIL
import os
import sys
from PIL import Image

location = sys.argv[1]
file_name = os.listdir(f"image/{location}")


for image in file_name:
    mywidth = 800
    img = Image.open(f"image/{location}/{image}")
    wpercent = (mywidth/float(img.size[0]))
    hsize = int((float(img.size[1])*float(wpercent)))
    img = img.resize((mywidth, hsize), PIL.Image.ANTIALIAS)
    img.save(f"image/{location}/{image}")
print("done")    
