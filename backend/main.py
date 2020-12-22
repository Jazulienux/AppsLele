import mysql.connector
from flask import Flask, jsonify, request, json
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token)
from werkzeug.utils import secure_filename
import os
import sys
import os
from cv2 import cv2
import time
import numpy as np
import re
import math
import numpy as np
import uuid
import base64
import pandas as pd
from sklearn.metrics import accuracy_score
from sklearn.model_selection import KFold
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import cross_val_score
from sklearn.naive_bayes import GaussianNB


app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'secret'

jwt = JWTManager(app)

UPLOAD_FOLDER = "/Users/jazulienux/Documents/Worked/Kuliah/Semester 7/3. Proyek 3/KejarApps/frontend/src/controller/video/"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="apps_lele"
)


@app.route('/users/login', methods=['POST'])
def login():
    mycursor = mydb.cursor()
    email = request.get_json()['email']
    password = request.get_json()['password']
    sql = "SELECT * FROM login WHERE email = '{}' AND password = '{}'".format(
        email, password)
    mycursor.execute(sql)
    myresult = mycursor.fetchall()
    if(len(myresult) > 0):
        access_token = create_access_token(identity={email: email})
        result = {"status": 1, "notif": access_token}
    else:
        result = jsonify(
            {"status": 0, "notif": "Invalid username and password"})

    return result


@app.route('/admin/upload/training', methods=['POST'])
def upload():
    target = os.path.join(UPLOAD_FOLDER, "training")
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files.get("file")
    filename = secure_filename(file.filename)
    destination = "/".join([target, filename])
    stats = 0
    if(os.path.exists(destination) == True):
        stats = 0
    else:
        file.save(destination)
        stats = 0
    return jsonify({"dir": filename, "stats": stats})


@app.route('/admin/upload/testing', methods=['POST'])
def upload_testing():
    target = os.path.join(UPLOAD_FOLDER, "testing")
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files.get("file")
    filename = secure_filename(file.filename)
    destination = "/".join([target, filename])
    stats = 0
    if(os.path.exists(destination) == True):
        stats = 0
    else:
        file.save(destination)
        stats = 0
    return jsonify({"dir": filename, "stats": stats})


@app.route('/admin/data/training', methods=['POST'])
def training():
    file = request.get_json()["file"]
    target = os.path.join(UPLOAD_FOLDER, "training")
    filename = secure_filename(file)
    destination = "/".join([target, filename])
    mycursor = mydb.cursor()
    sql = "SELECT * FROM `training` WHERE nama_video = '{}'".format(file)
    mycursor.execute(sql)
    myresult = mycursor.fetchall()

    alert = "Data Video Sudah Ditambahkan"
    if(len(myresult) == 0):
        cam = cv2.VideoCapture(destination)
        tempFrame = []
        width, height = 300, 600
        block_size = 100
        x = int(width/block_size)
        y = int(height / block_size)
        while(True):
            ret, frame = cam.read()
            if(ret == True):
                frame = cv2.resize(frame, (width, height))
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                ret, thresh1 = cv2.threshold(gray, 120, 255, cv2.THRESH_BINARY)
                kernel = np.ones((5, 5), np.uint8)
                dilasi = cv2.dilate(thresh1, kernel, iterations=1)
                result = cv2.resize(dilasi, (width, height))
                img = np.uint8([[[0, 0, 0]]])

                for i in range(y):
                    for j in range(x):
                        img = cv2.rectangle(
                            result, (0, i * block_size), ((j+1)*block_size, (i+1)*block_size), (0, 0, 0), 1)
                        cropped_box = img[i * block_size:(i+1) *
                                          block_size, j*block_size: (j+1)*block_size]
                        tempFrame.append(cropped_box)

            else:
                break

        idx = x * y
        idx_frame = idx
        nilai = 0
        box_total = 0
        total_nol = 0
        tempCor = []
        for i in range(len(tempFrame)):
            if(i == idx):
                idx += (x * y)

            if(idx < len(tempFrame)):
                frameA = tempFrame[i]
                frameB = tempFrame[idx_frame]
                poc = pharseCorealation(frameA, frameB)
                tempCor.append(poc)
                if(poc != 1):
                    nilai += poc
                    box_total += 1
                    if(poc == 0):
                        total_nol += 1

            idx_frame += 1

        label = re.split(r'[-_(.)]', file)
        size = np.array(label)
        tempLabel = ""
        for i in range(0, size.shape[0]):
            if (label[i].lower() == "cepat" or label[i].lower() == "lambat"):
                tempLabel = label[i].lower()
        label = tempLabel

        idx = x * y
        rerata = round(nilai / box_total, 5)
        tempCor = np.array(tempCor)
        tempCor = tempCor.reshape((-1, idx))
        data = []
        for i in range(0, tempCor.shape[0]):
            idx = []
            for j in range(0, tempCor.shape[1]):
                if (tempCor[i, j] != 1):
                    idx.append(j)
            if (len(idx) > 0):
                for k in range(len(idx)):
                    if (idx[k] not in data):
                        data.append(idx[k])
        banyak = len(data)
        print(banyak)
        total_nol = round((total_nol / box_total) * 100, 3)

        sql = "INSERT INTO `training`(`nama_video`, `rata_rata`, `banyak_box`, `total_nilai_nol`, `label`) VALUES ('{}','{}','{}','{}','{}')".format(
            file, rerata, banyak, total_nol, label)

        mycursor.execute(sql)
        mydb.commit()

        sql = "set @id = 0;"
        mycursor.execute(sql)
        mydb.commit()

        sql = "update training set id_training = (@id := @id + 1);"
        mycursor.execute(sql)
        mydb.commit()
        alert = "Data Berhasil Dimasukkan Ke Database"

        data = {
            "1": {
                "nama": "Nama Video",
                "result": file
            },
            "2": {
                "nama": "Rerata POC",
                "result": rerata
            },
            "3": {
                "nama": "Box Total POC",
                "result": banyak
            },
            "4": {
                "nama": "Total 0 Frame POC",
                "result": total_nol
            },
            "5": {
                "nama": "Label Video",
                "result": label
            }
        }
    else:
        data = {
            "1": {
                "nama": "Nama Video",
                "result": myresult[0][1]
            },
            "2": {
                "nama": "Rerata POC",
                "result": myresult[0][2]
            },
            "3": {
                "nama": "Box Total POC",
                "result": myresult[0][3]
            },
            "4": {
                "nama": "Total 0 Frame POC",
                "result": myresult[0][4]
            },
            "5": {
                "nama": "Label Video",
                "result": myresult[0][5]
            }
        }

    return jsonify({"alert": alert, "data": data})


@app.route('/admin/get_train', methods=['GET'])
def get_training():
    mycursor = mydb.cursor()
    sql = "SELECT * FROM `training`"
    mycursor.execute(sql)
    myresult = mycursor.fetchall()
    data = {}
    temp = ["id", "nama", "rerata", "box", "nilai_nol", "label"]
    for i in range(len(myresult)):
        data[i] = {}
        for j in range(len(myresult[0])):
            data[i][temp[j]] = myresult[i][j]

    return jsonify({"data": data})


@app.route('/admin/delete_train', methods=['POST'])
def delete_train():
    id = request.get_json()["id"]
    nama = request.get_json()["nama"]
    target = os.path.join(UPLOAD_FOLDER, "training")
    filename = secure_filename(nama)
    destination = "/".join([target, filename])
    os.remove(destination)
    mycursor = mydb.cursor()
    sql = "DELETE FROM `training` WHERE id_training = '{}'".format(id)
    mycursor.execute(sql)
    mydb.commit()
    result = "Data Video {} berhasil dihapus".format(nama)
    return jsonify({"result": result})


@app.route('/admin/update_train', methods=['POST'])
def update_train():
    id = request.get_json()["id"]
    mycursor = mydb.cursor()
    sql = "SELECT * FROM `training` WHERE id_training = '{}'".format(id)
    mycursor.execute(sql)
    myresult = mycursor.fetchall()
    data = {
        0: {
            "nama": "Nama Video",
            "result": myresult[0][1],
            "kode": "nama_video"
        },
        1: {
            "nama": "Rerata POC",
            "result": myresult[0][2],
            "kode": "rata_rata"
        },
        2: {
            "nama": "Box Total POC",
            "result": myresult[0][3],
            "kode": "banyak_box"
        },
        3: {
            "nama": "Total 0 Frame POC",
            "result": myresult[0][4],
            "kode": "total_nilai_nol"
        },
        4: {
            "nama": "Label Video",
            "result": myresult[0][5],
            "kode": "label"
        },
        5: {
            "nama": "ID Training",
            "result": myresult[0][0],
            "kode": "id_training"
        }
    }
    return jsonify({"data": data})


@app.route('/admin/update_train_video', methods=['POST'])
def update_train_video():
    nama_video = request.get_json()["data"]["nama_video"]
    rata_rata = request.get_json()["data"]["rata_rata"]
    banyak_box = request.get_json()["data"]["banyak_box"]
    total_nilai_nol = request.get_json()["data"]["total_nilai_nol"]
    label = request.get_json()["data"]["label"]
    id_training = request.get_json()["data"]["id_training"]
    sql = "UPDATE `training` SET `nama_video`='{}',`rata_rata`='{}',`banyak_box`='{}',`total_nilai_nol`='{}',`label`='{}' WHERE id_training = '{}'".format(
        nama_video, rata_rata, banyak_box, total_nilai_nol, label, id_training
    )
    mycursor = mydb.cursor()
    mycursor.execute(sql)
    mydb.commit()
    return jsonify({"alert": "Data Video {} Berhasil diupdate ".format(nama_video)})


@app.route('/admin/knn_metode', methods=['POST'])
def knn_metode():
    file = request.get_json()["file"]
    target = os.path.join(UPLOAD_FOLDER, "testing")
    filename = secure_filename(file)
    destination = "/".join([target, filename])

    cam = cv2.VideoCapture(destination)
    tempFrame = []
    width, height = 300, 600
    block_size = 100
    x = int(width/block_size)
    y = int(height / block_size)
    while(True):
        ret, frame = cam.read()
        if(ret == True):
            frame = cv2.resize(frame, (width, height))
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            ret, thresh1 = cv2.threshold(gray, 120, 255, cv2.THRESH_BINARY)
            kernel = np.ones((5, 5), np.uint8)
            dilasi = cv2.dilate(thresh1, kernel, iterations=1)
            result = cv2.resize(dilasi, (width, height))
            img = np.uint8([[[0, 0, 0]]])

            for i in range(y):
                for j in range(x):
                    img = cv2.rectangle(
                        result, (0, i * block_size), ((j+1)*block_size, (i+1)*block_size), (0, 0, 0), 1)
                    cropped_box = img[i * block_size:(i+1) *
                                      block_size, j*block_size: (j+1)*block_size]
                    tempFrame.append(cropped_box)

        else:
            break

    idx = x * y
    idx_frame = idx
    nilai = 0
    box_total = 0
    total_nol = 0
    tempCor = []
    for i in range(len(tempFrame)):
        if(i == idx):
            idx += (x * y)

        if(idx < len(tempFrame)):
            frameA = tempFrame[i]
            frameB = tempFrame[idx_frame]
            poc = pharseCorealation(frameA, frameB)
            tempCor.append(poc)
            if(poc != 1):
                nilai += poc
                box_total += 1
                if(poc == 0):
                    total_nol += 1

        idx_frame += 1

    idx = x * y
    rerata = round(nilai / box_total, 5)
    tempCor = np.array(tempCor)
    tempCor = tempCor.reshape((-1, idx))
    total_nol = round((total_nol / box_total) * 100, 3)
    data = []
    for i in range(0, tempCor.shape[0]):
        idx = []
        for j in range(0, tempCor.shape[1]):
            if (tempCor[i, j] != 1):
                idx.append(j)
        if (len(idx) > 0):
            for k in range(len(idx)):
                if (idx[k] not in data):
                    data.append(idx[k])
    banyak = len(data)

    mycursor = mydb.cursor()
    sql = "SELECT * FROM `training`"
    mycursor.execute(sql)
    dataTrain = []
    myresult = mycursor.fetchall()
    for i in range(len(myresult)):
        t = []
        for j in range(1, len(myresult[0])):
            t.append(myresult[i][j])
        dataTrain.append(t)

    dataTrainPandas = pd.DataFrame(
        dataTrain, columns=["nama", "rata", "box", "nilai_nol", "label"])

    tData = dataTrainPandas.drop(["nama"], axis="columns")
    x_train = tData.iloc[:, :-1].values
    y_train = tData["label"].values
    x_test = np.array([rerata, banyak, total_nol])
    k = request.get_json()["k"]
    knn = KNeighborsClassifier()
    knn.fit(x_train, y_train)
    scorePre = knn.score(x_train, y_train)

    res = []
    for i in range(len(x_train)):
        kurang_ed = x_train[i] - x_test
        kuadrat_ed = kurang_ed**2
        tambah_ed = np.sum(kuadrat_ed)
        akar_ed = math.sqrt(tambah_ed)
        result_ed = round(akar_ed, 3)

        kurang_md = abs(x_train[i] - x_test)
        result_md = np.sum(kurang_md)
        result_md = round(result_md, 3)

        res.append([dataTrainPandas["nama"][i],
                    result_ed, result_md, y_train[i]])

    resEd = np.array(res, dtype=object)
    resMd = np.array(res, dtype=object)
    for i in range(0, resEd.shape[0]):
        for j in range(0, resEd.shape[0] - 1):
            if(resEd[j][1] > resEd[j+1][1]):
                temp = []
                for k in range(0, resEd.shape[-1]):
                    temp.append(resEd[j][k])
                resEd[j] = resEd[j+1]
                resEd[j+1] = temp

            if(resMd[j][2] > resMd[j+1][2]):
                temp = []
                for k in range(0, resMd.shape[-1]):
                    temp.append(resMd[j][k])
                resMd[j] = resMd[j+1]
                resMd[j+1] = temp

    lb = ["nama", "ed", "md", "label"]
    dtRes = {}
    dTemp = {}

    for i in range(len(res)):
        dtRes[i] = {}
        dtResEd = []
        dtResMd = []
        dTemp[i] = {}
        for j in range(len(res[0])):
            dtRes[i][lb[j]] = res[i][j]
            dtResEd.append(resEd[i][j])
            dtResMd.append(resMd[i][j])

        dTemp[i][0] = dtResEd
        dTemp[i][1] = dtResMd

    if(k > len(myresult)):
        check = len(myresult)
        if(check % 2 == 1):
            k = check
        else:
            check -= 1
            k = check

    dominanEd = [0, 0]
    dominanMd = [0, 0]
    y_test = []
    y_test1 = []
    kSort = {}
    for i in range(k):
        kSort[i] = {}
        label = dTemp[i][0][3]
        label1 = dTemp[i][1][3]
        kSort[i][0] = dTemp[i][0]
        kSort[i][1] = dTemp[i][1]
        st = 0
        if(label == "cepat"):
            dominanEd[0] += 1
            st = 1
        else:
            dominanEd[1] += 1
            st = 0
        y_test.append(st)

        if(label1 == "cepat"):
            dominanMd[0] += 1
            st = 1
        else:
            dominanMd[1] += 1
            st = 0
        y_test1.append(st)

    if(dominanMd[0] > dominanMd[1]):
        y_true1 = np.ones(np.sum(dominanMd), dtype=int)
        labelMd = "Bibit Lele Kategori Cepat"
    else:
        y_true1 = np.zeros(np.sum(dominanMd), dtype=int)
        labelMd = "Bibit Lele Kategori Tidak Cepat"

    if(dominanEd[0] > dominanEd[1]):
        y_true = np.ones(np.sum(dominanEd), dtype=int)
        labelEd = "Bibit Lele Kategori Cepat"
    else:
        y_true = np.zeros(np.sum(dominanEd), dtype=int)
        labelEd = "Bibit Lele Kategori Tidak Cepat"

    accuracy = accuracy_score(y_true, y_test)
    accuracy = round(round(accuracy, 3) * 100, 3)

    accuracy1 = accuracy_score(y_true1, y_test1)
    accuracy1 = round(round(accuracy1, 3) * 100, 3)

    labelRes = [labelEd, labelMd]
    accuracyRes = [accuracy, accuracy1]

    y1 = []
    y2 = []
    for i in range(y_true.shape[0]):
        if(y_true[i] == 1):
            y1.append("Cepat")
        else:
            y1.append("Lambat")

        if(y_true1[i] == 1):
            y2.append("Cepat")
        else:
            y2.append("Lambat")

    yTrue = [y1, y2]
    scorePre = scorePre * 100
    scorePre = round(scorePre, 3)
    scorePre = str(scorePre)
    scorePre += " %"
    print(scorePre)
    return jsonify({"file": file, "ed": dtRes, "dSort": dTemp,
                    "label": labelRes,
                    "accuracy": accuracyRes,
                    "kSort": kSort,
                    "kInput": k,
                    "yTrue": yTrue,
                    "alert": "Data Testing Selesai Diuji",
                    "scorePre": scorePre})


@app.route('/admin/cross_val', methods=['POST'])
def cross_val():
    file = request.get_json()["file"]
    target = os.path.join(UPLOAD_FOLDER, "testing")
    filename = secure_filename(file)
    destination = "/".join([target, filename])

    cam = cv2.VideoCapture(destination)
    tempFrame = []
    width, height = 300, 600
    block_size = 100
    x = int(width/block_size)
    y = int(height / block_size)
    while(True):
        ret, frame = cam.read()
        if(ret == True):
            frame = cv2.resize(frame, (width, height))
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            ret, thresh1 = cv2.threshold(gray, 120, 255, cv2.THRESH_BINARY)
            kernel = np.ones((5, 5), np.uint8)
            dilasi = cv2.dilate(thresh1, kernel, iterations=1)
            result = cv2.resize(dilasi, (width, height))
            img = np.uint8([[[0, 0, 0]]])

            for i in range(y):
                for j in range(x):
                    img = cv2.rectangle(
                        result, (0, i * block_size), ((j+1)*block_size, (i+1)*block_size), (0, 0, 0), 1)
                    cropped_box = img[i * block_size:(i+1) *
                                      block_size, j*block_size: (j+1)*block_size]
                    tempFrame.append(cropped_box)

        else:
            break

    idx = x * y
    idx_frame = idx
    nilai = 0
    box_total = 0
    total_nol = 0
    tempCor = []
    for i in range(len(tempFrame)):
        if(i == idx):
            idx += (x * y)

        if(idx < len(tempFrame)):
            frameA = tempFrame[i]
            frameB = tempFrame[idx_frame]
            poc = pharseCorealation(frameA, frameB)
            tempCor.append(poc)
            if(poc != 1):
                nilai += poc
                box_total += 1
                if(poc == 0):
                    total_nol += 1

        idx_frame += 1

    idx = x * y
    rerata = round(nilai / box_total, 5)
    tempCor = np.array(tempCor)
    tempCor = tempCor.reshape((-1, idx))
    total_nol = round((total_nol / box_total) * 100, 3)
    data = []
    for i in range(0, tempCor.shape[0]):
        idx = []
        for j in range(0, tempCor.shape[1]):
            if (tempCor[i, j] != 1):
                idx.append(j)
        if (len(idx) > 0):
            for k in range(len(idx)):
                if (idx[k] not in data):
                    data.append(idx[k])
    banyak = len(data)
    mycursor = mydb.cursor()
    sql = "SELECT * FROM `training`"
    mycursor.execute(sql)
    dataTrain = []
    myresult = mycursor.fetchall()
    for i in range(len(myresult)):
        t = []
        for j in range(1, len(myresult[0])):
            t.append(myresult[i][j])
        dataTrain.append(t)

    dataTrainPandas = pd.DataFrame(
        dataTrain, columns=["nama", "rata", "box", "nilai_nol", "label"])

    tData = dataTrainPandas.drop(["nama"], axis="columns")
    x_train = tData.iloc[:, :-1].values
    y_train = tData["label"].values
    x_test = np.array([rerata, banyak, total_nol])

    n_splits = request.get_json()["nInput"]
    metode = request.get_json()["metode"]

    if(n_splits == 1):
        n_splits = 2
    else:
        if(n_splits >= len(myresult)):
            n_splits = len(myresult)
        else:
            n_splits = n_splits

    if(metode == 1):
        bestKnn = KNeighborsClassifier()
    else:
        bestKnn = GaussianNB()
    cv = KFold(n_splits=n_splits, random_state=42, shuffle=True)
    dataT = []
    dataM = []
    for train_index, test_index in cv.split(x_train):
        X_trainTemp, Y_trainTemp = x_train[train_index], y_train[train_index]
        X_testTemp, Y_testTemp = x_train[test_index], y_train[test_index]
        bestKnn.fit(X_trainTemp, Y_trainTemp)
        kF = []
        kT = []
        for idx in train_index:
            kF.append(dataTrainPandas.loc[idx, 'nama'])
        for idx in test_index:
            kT.append(dataTrainPandas.loc[idx, 'nama'])
        dataT.append([kF, kT])
        scores = round(bestKnn.score(X_testTemp, Y_testTemp) * 100., 3)
        dataM.append([bestKnn.predict([x_test])[0], str(scores)])

    return jsonify({"data": dataT, "nInput": n_splits, "fileTest": file, "dataM": dataM})


@app.route('/admin/naiveBayes_metode', methods=['POST'])
def naive_bayes():
    file = request.get_json()["file"]
    target = os.path.join(UPLOAD_FOLDER, "testing")
    filename = secure_filename(file)
    destination = "/".join([target, filename])

    cam = cv2.VideoCapture(destination)
    tempFrame = []
    width, height = 300, 600
    block_size = 100
    x = int(width/block_size)
    y = int(height / block_size)
    while(True):
        ret, frame = cam.read()
        if(ret == True):
            frame = cv2.resize(frame, (width, height))
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            ret, thresh1 = cv2.threshold(gray, 120, 255, cv2.THRESH_BINARY)
            kernel = np.ones((5, 5), np.uint8)
            dilasi = cv2.dilate(thresh1, kernel, iterations=1)
            result = cv2.resize(dilasi, (width, height))
            img = np.uint8([[[0, 0, 0]]])

            for i in range(y):
                for j in range(x):
                    img = cv2.rectangle(
                        result, (0, i * block_size), ((j+1)*block_size, (i+1)*block_size), (0, 0, 0), 1)
                    cropped_box = img[i * block_size:(i+1) *
                                      block_size, j*block_size: (j+1)*block_size]
                    tempFrame.append(cropped_box)

        else:
            break

    idx = x * y
    idx_frame = idx
    nilai = 0
    box_total = 0
    total_nol = 0
    tempCor = []
    for i in range(len(tempFrame)):
        if(i == idx):
            idx += (x * y)

        if(idx < len(tempFrame)):
            frameA = tempFrame[i]
            frameB = tempFrame[idx_frame]
            poc = pharseCorealation(frameA, frameB)
            tempCor.append(poc)
            if(poc != 1):
                nilai += poc
                box_total += 1
                if(poc == 0):
                    total_nol += 1

        idx_frame += 1

    idx = x * y
    rerata = round(nilai / box_total, 5)
    tempCor = np.array(tempCor)
    tempCor = tempCor.reshape((-1, idx))
    total_nol = round((total_nol / box_total) * 100, 3)
    data = []
    for i in range(0, tempCor.shape[0]):
        idx = []
        for j in range(0, tempCor.shape[1]):
            if (tempCor[i, j] != 1):
                idx.append(j)
        if (len(idx) > 0):
            for k in range(len(idx)):
                if (idx[k] not in data):
                    data.append(idx[k])
    banyak = len(data)
    mycursor = mydb.cursor()
    sql = "SELECT * FROM `training`"
    mycursor.execute(sql)
    dataTrain = []
    myresult = mycursor.fetchall()
    for i in range(len(myresult)):
        t = []
        for j in range(1, len(myresult[0])):
            t.append(myresult[i][j])
        dataTrain.append(t)

    dataTrainPandas = pd.DataFrame(
        dataTrain, columns=["nama", "rata", "box", "nilai_nol", "label"])

    tData = dataTrainPandas.drop(["nama"], axis="columns")
    x_train = tData.iloc[:, :-1].values
    y_train = tData["label"].values
    x_test = np.array([rerata, banyak, total_nol])

    nb = GaussianNB()
    nb.fit(x_train, y_train)
    scorePre = nb.score(x_train, y_train)
    scorePre = scorePre * 100
    scorePre = round(scorePre, 3)
    scorePre = str(scorePre)
    scorePre += " %"
    predict = nb.predict([x_test])

    data = {
        0: {
            "nama": "Nama Video",
            "result": file,
            "kode": "nama_video"
        },
        1: {
            "nama": "Rerata POC",
            "result": rerata,
            "kode": "rata_rata"
        },
        2: {
            "nama": "Box Total POC",
            "result": banyak,
            "kode": "banyak_box"
        },
        3: {
            "nama": "Total 0 Frame POC",
            "result": total_nol,
            "kode": "total_nilai_nol"
        },
        4: {
            "nama": "Prediksi Label Video",
            "result": predict[0],
            "kode": "label"
        }
    }

    return jsonify({"result": data, "file": file, "scorePre": scorePre})


def pharseCorealation(a, b):
    G_a = np.fft.fft2(a)
    G_b = np.fft.fft2(b)
    conj_b = np.ma.conjugate(G_b)
    R = G_a * conj_b
    R /= np.absolute(R)
    arr = R[R >= 0]
    r = np.array(arr.min())
    o = r.real
    p = float(o)
    q = round(p, 4)
    return q


if __name__ == "__main__":
    app.run(debug=True)
