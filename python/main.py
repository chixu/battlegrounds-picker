# -*- coding: utf-8 -*-
import datetime
import requests
from bs4 import BeautifulSoup
import os
import json
import PIL
from PIL import Image
import math
import time
import sys

url = 'https://playhearthstone.com/en-us/battlegrounds?type=hero%2Cminion&tier=1%2C2%2C3%2C4%2C5%2C6&viewMode=grid&collectible=0%2C1'
url_cn = 'https://hs.blizzard.cn/cards/battlegrounds?type=minion&tier=1%2C2%2C3%2C4%2C5%2C6&viewMode=grid&collectible=0%2C1'
url2 = 'https://api.blizzard.com/hearthstone/cards?sort=tier&order=asc&type=hero%2Cminion&tier=1%2C3%2C4%2C5%2C6&viewMode=grid&collectible=0%2C1&pageSize=200&locale=en_US'
parser = 'html.parser'
cur_path = os.getcwd() + '/'

header = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.104 Safari/537.36'}

# GET /hearthstone/cards?sort=tier&order=asc&type=hero%2Cminion&tier=1%2C3%2C4%2C5%2C6&viewMode=grid&collectible=0%2C1&pageSize=200&locale=en_US HTTP/1.1
# Host: api.blizzard.com
# Connection: keep-alive
# Pragma: no-cache
# Cache-Control: no-cache
# Authorization: Bearer USOg2jfFHziCXY7niNoe4gs2pnVqpdbHBt
# Origin: https://playhearthstone.com
# User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36
# Content-Type: application/json
# Accept: */*
# Sec-Fetch-Site: cross-site
# Sec-Fetch-Mode: cors
# Referer: https://playhearthstone.com/en-us/battlegrounds?type=hero%2Cminion&tier=1%2C3%2C4%2C5%2C6&viewMode=grid&collectible=0%2C1
# Accept-Encoding: gzip, deflate, br
# Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7

download_info = {}
cards = {}
cards_trim = {}
cards_count = 0

types = {
    '0': 'Normal',
    '15': 'Demon',
    '20': 'Beast',
    '17': 'Mech',
    '14': 'Murloc',
    '18': 'Elemental',
    '24': 'Dragon',
    '23': 'Pirate',
    '26': 'All'
}


def parse_cards():
    global cards
    global cards_trim
    for c in cards:
        name = c['name']
        id = c['id']
        tier = c['battlegrounds']['tier']
        minionTypeId = '0'
        if 'minionTypeId' in c:
            minionTypeId = c['minionTypeId'] or '0'
        desc = c["text"]
        typeName = types[str(minionTypeId)]
        fullname = str(tier) + '_' + typeName + '_' + name
        cards_trim[str(id)] = {
            "name": name,
            "tier": tier,
            "typeName": typeName,
            "desc": desc
        }


def downloadCards(lang=""):
    global cards
    global download_info
    download_path = "download" + lang + ".json"
    for c in cards:
        name = c['name']
        id = c['id']
        if id in download_info["cards"]:
            continue
        tier = c['battlegrounds']['tier']
        cardTypeId = c['cardTypeId']
        classId = c['classId']
        url = c['battlegrounds']['image']
        minionTypeId = '0'
        if 'minionTypeId' in c:
            minionTypeId = c['minionTypeId'] or '0'
        print(name, tier, minionTypeId)
        typeName = types[str(minionTypeId)]
        # print(name, tier, )
        # filename = str(tier) + '_' + typeName + '_' + name + '.png'
        filename = str(id) + '.png'
        path = os.path.join('images'+lang, filename)

        try:
            f = open(path, 'wb')
            f.write(requests.get(url, headers=header).content)
            f.close()
        except:
            save_json(download_path, download_info)
            sys.exit()
        download_info["cards"].append(id)
        time.sleep(1)
    
    save_json(download_path, download_info)


def merge_image(lang=""):
    global cards_count
    count = cards_count
    col_max = 10
    global cards_trim
    rows = math.ceil(count / col_max)
    img_width = 0
    img_height = 0
    img_folder_path = "./images_150" + lang
    directory = os.fsencode(img_folder_path)

    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        img_path = os.path.join(img_folder_path, filename)
        img = Image.open(img_path)
        img_width = img.size[0]
        img_height = img.size[1]
        break

    dst = Image.new('RGBA', (img_width * col_max, img_height * rows))
    count = 0
    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        x = count % col_max * img_width
        y = math.floor(count / col_max) * img_height
        cards_trim[filename[:-4]]["pos"] = [x, y]
        img_path = os.path.join(img_folder_path, filename)
        img = Image.open(img_path)
        dst.paste(img, (x, y))
        count += 1
        # if filename.endswith(".asm") or filename.endswith(".py"):
        #     print(os.path.join(directory, filename))
        # else:
        #     continue
    # dst.paste(im1, (0, 0))
    # dst.paste(im2, (im1.width, 0))
    dst.save('./cards_150'+lang+'.png')

    file = open('cards_150'+lang+'.json', 'w')
    file.write(json.dumps(cards_trim))
    file.close()

# break


def save_json(file_name, obj):
    file = open(file_name, 'w')
    file.write(json.dumps(obj))
    file.close()


def minify_image(lang):
    basewidth = 130
    for c in cards:
        # name = c['name']
        id = c['id']
        # tier = c['battlegrounds']['tier']
        # cardTypeId = c['cardTypeId']
        # classId = c['classId']
        # url = c['battlegrounds']['image']
        # minionTypeId = '0'
        # if 'minionTypeId' in c:
        #     minionTypeId = c['minionTypeId']
        # typeName = types[str(minionTypeId)]
        # print(name, tier, )
        # filename = str(tier) + '_' + typeName + '_' + name + '.png'
        filename = str(id) + '.png'
        path = os.path.join('images'+lang, filename)
        path2 = os.path.join('images_150'+lang, filename)
        img = Image.open(path)
        wpercent = (basewidth / float(img.size[0]))
        hsize = int((float(img.size[1]) * float(wpercent)))
        img = img.resize((basewidth, hsize), PIL.Image.ANTIALIAS)
        img.save(path2)


def remove_directory(lang=""):
    import shutil
    img_path = "images" + lang
    img_150_path = "images_150" + lang

    if os.path.exists(img_path):
        shutil.rmtree(img_path)
    if os.path.exists(img_150_path):
        shutil.rmtree(img_150_path)

def create_directory(lang=""):
    img_path = "images" + lang
    img_150_path = "images_150" + lang
    if not os.path.exists(img_path):
        os.makedirs(img_path)
    if not os.path.exists(img_150_path):
        os.makedirs(img_150_path)

def run(lang=""):
    global cards
    global cards_trim
    global cards_count
    global download_info
    f = open("data" + lang + ".json", "r", encoding='UTF-8')
    obj = json.loads(f.read())
    cards = obj['cards']
    cards_count = obj['cardCount']
    cards_trim = {}

    today = datetime.datetime.strftime(datetime.datetime.now(), '%Y%m%d')
    print(today)
    download_path = "download" + lang + ".json"
    if os.path.exists(download_path):
        f = open(download_path)
        download_info = json.loads(f.read())
        if download_info["date"] != today:
            download_info = {"date": today, "cards": []}
            remove_directory(lang)
    else:
        download_info = {"date": today, "cards": []}

    
    create_directory(lang)
    parse_cards()
    downloadCards(lang)
    minify_image(lang)
    merge_image(lang)


run()
run("_cn")
