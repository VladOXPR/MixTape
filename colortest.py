from colorthief import ColorThief
import matplotlib.pyplot as plt
import colorsys

ct = ColorThief("media/cover_images/virus_hYHADZP.png")
pallete = ct.get_palette(color_count=3)

plt.imshow([[pallete[i] for i in range(len(pallete))]])
plt.show()