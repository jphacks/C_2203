# -*- coding: utf-8 -*-
import cv2
import cv2.aruco as aruco
import numpy as np
import time


def gomi_detect(frame, bg):
    th = 60
    is_detect = False
    gomi_xy = (0, 0)
    # グレースケール変換
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # 差分の絶対値を計算
    mask = cv2.absdiff(gray, bg)

    # 差分画像を二値化してマスク画像を算出
    mask[mask < th] = 0
    mask[mask >= th] = 255

    # 輪郭抽出する。
    contours = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0]

    # 小さい輪郭は除く
    # contours = list(filter(lambda x: cv2.contourArea(x) > 100, contours))

    # 輪郭最大のもの
    if len(contours) > 0:
        max_contour = max(contours, key=lambda x: cv2.contourArea(x))
        pre_x, pre_y = 0, 0
        x, y, w, h = cv2.boundingRect(max_contour)
        # for x, y, w, h in bboxes:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        obj_x = x+w/2
        obj_y = y+h/2
        if np.abs(obj_x - pre_x) >= 1.0 and np.abs(obj_y - pre_y) >= 1.0:
            is_detect = True
            pre_x = obj_x
            pre_y = obj_y
            # print(f"x: {obj_x}, y: {obj_y}")
            gomi_xy = (int(obj_x), int(obj_y))

    return mask, is_detect, gomi_xy


def get_car_dir(frame, gomi_xy):
    aruco_dict = aruco.getPredefinedDictionary(aruco.DICT_4X4_50)

    parameters = aruco.DetectorParameters_create()
    corners, ids, _ = aruco.detectMarkers(frame, aruco_dict, parameters=parameters)
    # frame = aruco.drawDetectedMarkers(frame, corners, ids)

    if np.all(ids != None):
        for corner in corners:
            points = corner[0].astype(np.int32)
            # マーカーの輪郭の検出
            cv2.polylines(frame, [points], True, (255,0,0))
            fw = (int((points[0][0]+points[1][0])/2), int((points[0][1]+points[1][1])/2))
            bc = (int((points[2][0]+points[3][0])/2), int((points[2][1]+points[3][1])/2))
            cv2.arrowedLine(frame, bc, fw, (0, 0, 255), thickness=3)
            cv2.drawMarker(frame, gomi_xy, (0, 0, 0), markerType=cv2.MARKER_STAR, markerSize=10)
            cv2.arrowedLine(frame, fw, gomi_xy, (255, 0, 0), thickness=3)


def main():
    mode = 1
    detect_count = 0
    gomi_xy = (0, 0)

    cap = cv2.VideoCapture(0)

    # 最初のフレームを背景画像に設定
    ret, bg = cap.read()
    bg = cv2.cvtColor(bg, cv2.COLOR_BGR2GRAY)

    while(cap.isOpened()):
        # フレームの取得
        ret, frame = cap.read()

        if frame is None:
            break

        if mode == 1:
            mask, is_detect, gomi_xy = gomi_detect(frame, bg)
            if is_detect:
                detect_count += 1
            else:
                detect_count = 0
            # ゴミを検出して3秒経過したらモード2に移行
            if detect_count >= 60:
                mode = 2
                print("ゴミの位置を特定．移動を開始します．")
        elif mode == 2:
            # mask = get_car_dir(frame, gomi_xy)
            get_car_dir(frame, gomi_xy)

        # フレームとマスク画像を表示
        # cv2.imshow("Mask", mask)
        cv2.imshow("Frame", frame)

        time.sleep(0.05)


        # qキーが押されたら途中終了
        # if cv2.waitKey(1) & 0xFF == ord('q'):
        #     break
        k = cv2.waitKey(10)

        if k == ord('q'):
            break
        elif k == ord('r'):
            mode = 1
            detect_count = 0
            ret, bg = cap.read()
            bg = cv2.cvtColor(bg, cv2.COLOR_BGR2GRAY)

    cap.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    main()