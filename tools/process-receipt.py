#!/usr/bin/env python

import warnings
warnings.filterwarnings("ignore", message="numpy.dtype size changed")

import matplotlib.pyplot as plt
from skimage.filters import threshold_otsu, threshold_minimum, threshold_isodata
import matplotlib.cm as cm
from skimage.io import imread
from skimage.transform import rotate

img_dir = '/Users/carolyn/projects/magic-mirror/test-data/receipts/heb/'
out_dir = '/Users/carolyn/projects/magic-mirror/test-data/receipts/heb/out/'
imgs = [
    '20180808_135052.jpg',
    '20180808_135153.jpg',
    '20180808_135220.jpg',
    '20180808_135525.jpg'
]

img = imread('/Users/carolyn/projects/magic-mirror/test-data/receipts/heb/20180808_135052.jpg', as_gray=True)
#img = img[0:1000, 650:1100]   # crop image to zoom in to jar
rotated = rotate(img, 270)

#fig, ax = try_all_threshold(rotated, figsize=(10, 25), verbose=False)
#plt.savefig('all-thresholds.png', dpi=500)

# best results seem to be isodata, minimum, and otsu

def test_thresholds(i):
    img = imread(img_dir + i, as_gray=True)
    rotated = rotate(img, 270)

    otsu_thresh = threshold_otsu(rotated)
    min_thresh = threshold_minimum(rotated)
    isodata_thresh = threshold_isodata(rotated)

    print otsu_thresh, min_thresh, isodata_thresh

    return

    otsu_img = rotated > otsu_thresh
    min_img = rotated > min_thresh
    isodata_img = rotated > isodata_thresh

    print otsu_img

    plt.imsave(out_dir + 'otsu-' + i, otsu_img, cmap=cm.gray)
    plt.imsave(out_dir + 'min-' + i, min_img, cmap=cm.gray)
    plt.imsave(out_dir + 'iso-' + i, isodata_img, cmap=cm.gray)

for i in imgs:
    test_thresholds(i)
