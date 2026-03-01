from PIL import Image

img = Image.open('client/public/assets/logo-white.png')
print(f"Size: {img.size}, Mode: {img.mode}")

# We want to find the non-transparent bounding box
bbox = img.getbbox()
print(f"Bounding box: {bbox}")

# We can crop the bottom 30% of the image which might be the text?
# Let's save a cropped version and see if it looks right
width, height = img.size
cropped = img.crop((0, int(height * 0.6), width, height))
cropped.save('client/public/assets/lux-box-extracted.png')
print("Saved extracted.png")
