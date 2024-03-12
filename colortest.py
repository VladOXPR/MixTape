from colorthief import ColorThief
import matplotlib.pyplot as plt
import colorsys

ct = ColorThief("media/cover_images/background.png")
pallete = ct.get_palette(color_count=3)
print(pallete)

plt.imshow([[pallete[i] for i in range(len(pallete))]])
plt.show()