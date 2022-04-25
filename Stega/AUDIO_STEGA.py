import numpy as np
import wave
from PIL import Image
import io

big = r"Objects\big_image.png"
bmp = r'Objects\bmp_image.bmp'
png = "Objects\small_image.png"
jpg = "Objects\jpg_img.jpg"
txt = "Objects\cover.txt"
docx = "Objects\cover.docx"
wav = "Objects\sound.wav"
xlsx = "Objects\cover.xlsx"
pdf = "Objects\cover.pdf"
mp3 = "Objects\payload.mp3"
mov = "Objects\cover.mov"


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


def to_bin(data):
    if isinstance(data, str):
        return ''.join([format(ord(i), "08b") for i in data])
    elif isinstance(data, bytes) or isinstance(data, np.ndarray):
        return [format(i, "08b") for i in data]
    elif isinstance(data, int) or isinstance(data, np.uint8):
        return format(data, "08b")
    else:
        raise TypeError("Type not supported.")


def audio_stega(cover, payload, n_lsb):
    # open audio file
    audio = wave.open(cover, mode="rb")
    # save file extension
    filetype = str.split(payload, ".")[-1]
    delimit = filetype[0:2] + "!!!"
    print(filetype.capitalize() + " Detected.")
    with open(payload, 'rb') as f:
        a = f.read()
    payload_bin = ''.join(format(n_lsb, "04b"))
    payload_bin += ''.join(format(i, "08b")for i in a)
    payload_bin += ''.join(format(ord(i), "08b")for i in delimit)
    frame_bytes = bytearray(list(audio.readframes(audio.getnframes())))
    data_len = len(payload_bin)
    if data_len > len(frame_bytes)*n_lsb:
        raise ValueError("Cover Image is too small!!!")
    else:
        a = audio_encode(frame_bytes, payload_bin, n_lsb)
        with wave.open("Encoded"+"\\"+filetype + "_in_audio.wav", 'wb') as new:
            new.setparams(audio.getparams())
            new.writeframes(a)
        audio.close()
        print(filetype.capitalize() + " encoded into Audio!")


def audio_encode(frame_bytes, payload_bin, n_lsb):
    data_index = 4
    data_len = len(payload_bin)
    for i in range(len(frame_bytes)):
        data_remainder = data_len-data_index
        if i == 0:
            frame_bytes[i] = int(
                to_bin(frame_bytes[i])[:-4] + payload_bin[0:4], 2)
            continue
        if data_index < data_len:
            if data_remainder < n_lsb:
                frame_bytes[i] = int(
                    to_bin(frame_bytes[i])[:-n_lsb] + payload_bin[-data_remainder:] + '1' * (n_lsb - data_remainder), 2)
            else:
                frame_bytes[i] = int(
                    to_bin(frame_bytes[i])[:-n_lsb] + payload_bin[data_index:data_index+n_lsb], 2)
            data_index += n_lsb
        else:
            break
    return frame_bytes


def audio_decode(stego):
    n_lsb = ''
    audio = wave.open(stego, mode="rb")
    frame_bytes = bytearray(list(audio.readframes(audio.getnframes())))
    bin_data = ''
    all_bytes = ''
    decoded_data = ''
    bytearr = ''
    for i in range(len(frame_bytes)):
        if i == 0:
            n_lsb = int(format(frame_bytes[i], '08b')[-4:], 2)
            continue
        bin_data += format(frame_bytes[i], '08b')[-n_lsb:]
    all_bytes = [bin_data[i: i+8] for i in range(0, len(bin_data), 8)]
    for byte in all_bytes:
        decoded_data += chr(int(byte, 2))
        bytearr += byte
        if decoded_data[-3:] == "!!!":
            break
    if "!!!" not in decoded_data:
        raise ValueError("Invalid Audio File")
    filetype = set_type(decoded_data[-5:-3])
    if filetype == 'png' or filetype == 'jpg' or filetype == 'bmp':
        bytemsg = bytearr[:-40]
        temp = bytearray([int(bytemsg[i:i+8], 2)
                          for i in range(0, len(bytemsg), 8)])
        image = Image.open(io.BytesIO(temp))
        image.save('Decoded\decode.'+filetype)
        print("Payload " + filetype + " reconstructed...")
    else:
        bytemsg = bytearr[:-40]
        temp = bytearray([int(bytemsg[i:i+8], 2)
                          for i in range(0, len(bytemsg), 8)])
        f = open('Decoded\decoded.' + filetype, 'wb')
        f.write(temp)
        f.close()
        print("Payload " + filetype + " reconstructed...")


audio_stega(wav, mov, 5)
audio_decode("Encoded"+"\\" + 'mov' + "_in_audio.wav")
