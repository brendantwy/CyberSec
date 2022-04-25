
"""! 
@file IMAGE_STEGA.py
@author CSC2004 Team 7
@version 1.0
@brief This file performs image steganography
@section DESCRIPTION
Contains encode decode for image steganography
"""

from PIL import Image
import io
import sys
import os

# big = r"./public/images/Objects/big_image.png"
# bmp = r'./public/images/Objects/bmp_image.bmp'
# png = "./public/images/Objects/small_image.png"
# jpg = "./public/images/Objects/jpg_img.jpg"
# txt = "./public/images/Objects/cover.txt"
# docx = "./public/images/Objects/cover.docx"
# wav = "./public/images/Objects/sound.wav"
# xlsx = "./public/images/Objects/cover.xlsx"
# pdf = "./public/images/Objects/cover.pdf"


def set_type(string):
    if string == 'pn':
        return 'png'
    elif string == 'jp':
        return 'jpg'
    elif string == 'bm':
        return 'bmp'
    elif string == 'do':
        return 'docx'
    elif string == 'pd':
        return 'pdf'
    elif string == 'xl':
        return 'xlsx'
    elif string == 'wa':
        return 'wav'
    elif string == 'mp':
        return 'mp3'
    elif string == 'mo':
        return 'mov'
    elif string == 'fl':
        return 'flac'


def image_stega(cover, payload, n_lsb):
    """! Image Steganography
        @brief image_stega takes in cover, payload and number of lsb as params
        to check if cover image size is big enough to encode the payload and 
        convert payload into binary
        If cover image is too small, raise exception 
        else perform image decode and save file
        @param cover cover file for steganography
        @param payload the payload file to be encoded into cover file
        @param n_lsb the number of LSB to be used to encode the payload
    """

    img = Image.open(cover)  # open image cover
    w, h = img.size  # Get the width and height of the image cover
    # split cover file name to retrieve file type via it's extension
    cover_filetype = str.split(cover, ".")[-1]
    # split payload file name to retrieve file type via it's extension
    filetype = str.split(payload, ".")[-1]
    # Append delimiter to the end of payload file
    delimit = filetype[0:2] + "!!!"
    # print(filetype.capitalize() + " Detected.")
    with open(payload, 'rb') as f:  # read payload file as binary
        a = f.read()  # read the whole entire payload
    # convert number of lsb to 6 bit binary
    payload_bin = ''.join(format(n_lsb, "06b"))
    # perform string concatenation to convert each line in payload to a 8bit binary
    payload_bin += ''.join(format(i, "08b")for i in a)
    # converts each line of payload binary into integer for each line in delimiter
    payload_bin += ''.join(format(ord(i), "08b")for i in delimit)
    data_len = len(payload_bin)  # get total number of bits in payload
    if data_len > w*h*n_lsb:  # check if the number of bits in payload is more than cover
        # throw an exception payload size is bigger than cover size
        print("Cover Image is too small!!!")
    else:
        # payload within cover image with the specified lsb
        a = image_encode(img, payload_bin, n_lsb)
        # save the file under 'Encoded' directory
        a.save('./public/images/Encoded/encoded.' + cover_filetype)
        print("Success")
        # print(filetype.capitalize() + " encoded into Image!")


def image_encode(img, payload_bin, n_lsb):
    """! Image encoding
        @brief image_encode performs the encoding of payload into cover file based on the
        number of lsb specified
        @param img image cover
        @param payload_bin the payload file in binary
        @param n_lsb the number of LSB to be used to encode the payload
    """
    pixels = img.load()  # load the number of pixels in cover image
    width, height = img.size  # obtain the width and heigh of the cover image
    data_index = 6  # set the data index for image encoding
    data_length = len(payload_bin)  # get the length of the payload in binary
    # flag = n_lsb * '1'
    # pixels[0, 0] = (pixels[0, 0][0] ^ int(flag, 2),
    #                 pixels[0, 0][1], pixels[0, 0][2])
    for j in range(height):
        for i in range(width):
            pixel = pixels[i, j]  # for each pixel in cover image
            # Retrieve the rgb frame in each pixel in 8bit format
            r, g, b = [format(i, "08b") for i in pixel]
            if i == 0 and j == 0:  # if it is the first pixel of cover image
                # set r,g,b from start index to n'th number of bits
                r, g, b = r[:-n_lsb], g[:-n_lsb], b[:-n_lsb]
                r += payload_bin[0:2]  # set nlsb for red frame
                g += payload_bin[2:4]  # set nlsb for green frame
                b += payload_bin[4:6]  # set nlsb for blue frame
                # Convert the bit string into binary
                pixels[i, j] = (int(r, 2), int(g, 2), int(b, 2))
                continue
            if data_index >= data_length:
                break  # you have reached the end of the payload file
            # red pix
            if data_index < data_length:  # if the index of the array is less than the length of the payload in binary
                # get the remainder bits within the cover by subtracting the length of the payload in binary with the current array index
                data_remainder = data_length - data_index
                r = r[:-n_lsb]  # slice cover bits from red frame
                if data_remainder < n_lsb:  # if the remaining bits is lesser n'th bits in lsb
                    r += payload_bin[-data_remainder:] + \
                        '1' * \
                        (n_lsb - data_remainder)  # append to red frame with remaining lsb
                else:
                    # append to red frame with the end of the array index
                    r += payload_bin[data_index:data_index+n_lsb]
                data_index += n_lsb  # increment the array index
            # green pix
            if data_index < data_length:  # if current array index is less than total length of the payload in binary
                # get the remainder bits within the cover by subtracting the length of the payload in binary with the current array index
                data_remainder = data_length - data_index
                g = g[:-n_lsb]  # slice cover bits from green frame
                if data_remainder < n_lsb:  # if the remaining bits is lesser n'th bits in lsb
                    g += payload_bin[-data_remainder:] + \
                        '1' * \
                        (n_lsb - data_remainder)  # append to green frame with remaining lsb
                else:
                    # append to red frame with the end of the array index
                    g += payload_bin[data_index:data_index+n_lsb]
                data_index += n_lsb  # increment the array index
            # blue pix
            if data_index < data_length:  # if current array index is less than total length of the payload in binary
                # get the remainder bits within the cover by subtracting the length of the payload in binary with the current array index
                data_remainder = data_length - data_index
                b = b[:-n_lsb]  # slice cover bits from blue frame
                if data_remainder < n_lsb:  # if the remaining bits is lesser n'th bits in lsb
                    b += payload_bin[-data_remainder:] + \
                        '1' * \
                        (n_lsb - data_remainder)  # append to blue frame with remaining lsb
                else:
                    # append to red frame with the end of the array index
                    b += payload_bin[data_index:data_index+n_lsb]
                data_index += n_lsb  # increment the array index
            # Convert the bit string into binary
            pixels[i, j] = (int(r, 2), int(g, 2), int(b, 2))
            # finish encoding
            if data_index >= data_length:  # if the current array index is more than or equal to the payload length in bits, break program
                break
    return img  # return cover image


def image_decode(stego):
    img = Image.open(stego)  # open the stego file
    pixels = img.load()  # load all the pixels withi the image
    w, h = img.size  # get the width and heigh of the image
    n_lsb = ''  # initialise nlsb
    bin_data = ''  # initialise binary data
    all_bytes = ''  # initialise all bytes of the payload + cover
    decoded_data = ''  # initialise decoded data
    bytearr = ''  # initialise byte array
    for j in range(h):
        for i in range(w):
            # Get individual pixel count from an array of pixels
            pixel = pixels[i, j]
            # for each pixel, extract the red green blue frame
            r, g, b = [format(i, "08b") for i in pixel]
            if j == 0 and i == 0:  # if it is first pixel of image
                n_lsb += r[-2:]  # get the nlsb for red frame
                n_lsb += g[-2:]  # get the nlsb for green frame
                n_lsb += b[-2:]  # get the nlsb for blue frame
                n_lsb = int(n_lsb, 2)  # convert nlsb into binary
                continue
            bin_data += r[-n_lsb:]
            bin_data += g[-n_lsb:]
            bin_data += b[-n_lsb:]
    all_bytes = [bin_data[i: i+8] for i in range(0, len(bin_data), 8)]
    for byte in all_bytes:
        bytearr += byte
        decoded_data += chr(int(byte, 2))
        if decoded_data[-3:] == "!!!":
            break
    if "!!!" not in decoded_data:
        print("Invalid Image File")
    filetype = set_type(decoded_data[-5:-3])
    if filetype == 'png' or filetype == 'jpg' or filetype == 'bmp':
        bytemsg = bytearr[:-40]
        bytemsg = bytearray([int(bytemsg[i:i+8], 2)
                             for i in range(0, len(bytemsg), 8)])
        image = Image.open(io.BytesIO(bytemsg))
        image.save('./public/images/Decoded/decoded.'+filetype)
        print("Payload " + filetype + " reconstructed...")
    else:
        bytemsg = bytearr[:-40]
        temp = bytearray([int(bytemsg[i:i+8], 2)
                          for i in range(0, len(bytemsg), 8)])
        f = open('./public/images/Decoded/decoded.' + filetype, 'wb')
        f.write(temp)
        f.close()
        print("Payload " + filetype + " reconstructed...")


if __name__ == "__main__":

    if(sys.argv[1] == 'encode'):
        image_stega(sys.argv[2], sys.argv[3], int(sys.argv[4]))
    elif(sys.argv[1] == 'decode'):
        image_decode(sys.argv[2])
