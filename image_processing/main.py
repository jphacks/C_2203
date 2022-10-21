# -*- coding: utf-8 -*-
from asyncore import write
import cv2
import cv2.aruco as aruco
import numpy as np
import serial

import time

serialBT = serial.Serial('COM4', 9600)

def gomi_detect(frame, bg):
    th = 70
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

    fw = (0,0)
    bc = (0, 0)
    if len(corners) != 0:
        for corner in corners:
            points = corner[0].astype(np.int32)
            # マーカーの輪郭の検出
            cv2.polylines(frame, [points], True, (255,0,0))
            fw = (int((points[0][0]+points[1][0])/2), int((points[0][1]+points[1][1])/2))
            bc = (int((points[2][0]+points[3][0])/2), int((points[2][1]+points[3][1])/2))
            # cv2.arrowedLine(frame, bc, fw, (0, 0, 255), thickness=3)
            # cv2.drawMarker(frame, gomi_xy, (0, 0, 0), markerType=cv2.MARKER_STAR, markerSize=10)
            # cv2.arrowedLine(frame, fw, gomi_xy, (255, 0, 0), thickness=3)

            return fw, bc
    else:
        return None, None


def get_angle_and_dir(u, v):
    i = np.inner(u, v)
    n = np.linalg.norm(u) * np.linalg.norm(v)
    c = i / n
    cr = np.cross(u, v)
    dir = 0
    if cr >= 0:
        dir = 0
    else:
        dir = 1
    return np.rad2deg(np.arccos(np.clip(c, -1.0, 1.0))), dir


def write_to_esp(code, cool_time=0.1):
    serialBT.write(code.encode())
    time.sleep(cool_time)


def car_control(car_control_flag, theta, target_dir, dist, is_return):
    STOP_DIST = 20
    STOP_THETA = 10
    # if dist < STOP_DIST+10:
    #     STOP_THETA = 2 if not is_return else 8
    if dist < STOP_DIST+40:
        STOP_THETA = 5 if not is_return else 8
    is_reached = False
    if car_control_flag == 0: # 停止時
        if dist > STOP_DIST+5:
            if theta <= STOP_THETA+1:
                print("前進")
                write_to_esp("f")
                car_control_flag = 1
            elif target_dir == 0:
                print("右回転")
                write_to_esp("r")
                car_control_flag = 3
            elif target_dir == 1:
                print("左回転")
                write_to_esp("l")
                car_control_flag = 4
        elif theta > STOP_THETA+3:
            if target_dir == 0:
                print("右回転")
                write_to_esp("r")
                car_control_flag = 3
            elif target_dir == 1:
                print("左回転")
                write_to_esp("l")
                car_control_flag = 4
        else:
            print("接近")
            car_control_flag = 5

    elif car_control_flag == 1: # 前進時
        if dist <= STOP_DIST or theta > STOP_THETA+1:
            print("前進停止")
            write_to_esp("s", 0.1)
            car_control_flag = 0

    elif car_control_flag == 3 or car_control_flag == 4:
        if theta <= STOP_THETA:
            print("回転停止")
            write_to_esp("s", 0.1)
            car_control_flag = 0

    elif car_control_flag == 5:
        if not is_return:
            write_to_esp("o", 3.0)
            write_to_esp("c", 3.0)
        else:
            write_to_esp("o", 3.0)
            # write_to_esp("b", 1.0)
            # write_to_esp("r", 7.0)
            # write_to_esp("s", 0.1)
        car_control_flag = 0
        is_reached = True


    return car_control_flag, is_reached


def main():
    mode = 0
    detect_cnt = 0
    start_cnt = 0
    stop_cool_cnt = 0
    gomi_xy = (0, 0)
    goal_xy = (640, 600)
    car_control_flag = 0
    is_return = False

    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    cap.set(cv2.CAP_PROP_AUTOFOCUS, 0)
    cap.set(cv2.CAP_PROP_FOCUS, 0)

    # 最初のフレームを背景画像に設定
    # ret, bg = cap.read()
    # bg = cv2.cvtColor(bg, cv2.COLOR_BGR2GRAY)

    while(cap.isOpened()):
        # フレームの取得
        ret, frame = cap.read()
        if frame is None:
            break

        if mode == 0:
            # cv2.drawMarker(frame, goal_xy, (0, 0, 0), markerType=cv2.MARKER_STAR, markerSize=10)
            pass
            # if start_cnt < 50:
            #     start_cnt += 1
            # else:
            #     start_cnt += 1
            #     mode = 1
            #     print("ゴミ検知を開始")
            #     bg = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        if mode == 1:
            mask, is_detect, gomi_xy = gomi_detect(frame, bg)
            if is_detect:
                detect_cnt += 1
            else:
                detect_cnt = 0
            # ゴミを検出して3秒経過したらモード2に移行
            if detect_cnt >= 60:
                mode = 2
                print("ゴミの位置を特定．移動を開始します．")
        elif mode == 2:
            # mask = get_car_dir(frame, gomi_xy)
            fw_xy, bc_xy = get_car_dir(frame, gomi_xy)
            if fw_xy is not None:
                cv2.arrowedLine(frame, bc_xy, fw_xy, (0, 0, 255), thickness=3)
                cv2.drawMarker(frame, gomi_xy, (0, 0, 0), markerType=cv2.MARKER_STAR, markerSize=10)
                cv2.arrowedLine(frame, fw_xy, gomi_xy, (255, 0, 0), thickness=3)
                print("車を検知．移動を開始します．")
                # goal_xy = bc_xy
                time.sleep(3)
                mode = 3
        elif mode == 3:
            fw_xy, bc_xy = get_car_dir(frame, gomi_xy)
            if fw_xy is not None:
                cv2.arrowedLine(frame, bc_xy, fw_xy, (0, 0, 255), thickness=3)
                cv2.drawMarker(frame, gomi_xy, (0, 0, 0), markerType=cv2.MARKER_STAR, markerSize=10)
                cv2.arrowedLine(frame, fw_xy, gomi_xy, (255, 0, 0), thickness=3)
                car_vec = np.array([fw_xy[0] - bc_xy[0], fw_xy[1] - bc_xy[1]])
                gomi_vec = np.array([gomi_xy[0] - fw_xy[0], gomi_xy[1] - fw_xy[1]])
                target_vec = np.array([gomi_xy[0] - bc_xy[0], gomi_xy[1] - bc_xy[1]])
                theta, target_dir = get_angle_and_dir(car_vec, target_vec)
                dist = np.linalg.norm(gomi_vec, ord=2)
                print(f"theta: {theta}, dir:{target_dir}, dist:{dist}")

                car_control_flag, is_reached = car_control(car_control_flag, theta, target_dir, dist, is_return)

                if is_reached:
                    print("ゴミを取得しました．戻ります．")
                    is_return = True
                    mode = 5

        elif mode == 4:
            fw_xy, bc_xy = get_car_dir(frame, gomi_xy)
            if fw_xy is not None:
                cv2.arrowedLine(frame, bc_xy, fw_xy, (0, 0, 255), thickness=3)
                cv2.drawMarker(frame, gomi_xy, (0, 0, 0), markerType=cv2.MARKER_STAR, markerSize=10)
                cv2.arrowedLine(frame, fw_xy, gomi_xy, (255, 0, 0), thickness=3)
            stop_cool_cnt += 1
            if stop_cool_cnt > 30:
                mode = 3 if not is_return else 5
                stop_cool_cnt = 0

        elif mode == 5:
            fw_xy, bc_xy = get_car_dir(frame, gomi_xy)
            if fw_xy is not None:
                cv2.arrowedLine(frame, bc_xy, fw_xy, (0, 0, 255), thickness=3)
                cv2.drawMarker(frame, goal_xy, (0, 0, 0), markerType=cv2.MARKER_STAR, markerSize=10)
                cv2.arrowedLine(frame, fw_xy, goal_xy, (255, 0, 0), thickness=3)
                car_vec = np.array([fw_xy[0] - bc_xy[0], fw_xy[1] - bc_xy[1]])
                target_dist_vec = np.array([goal_xy[0] - fw_xy[0], goal_xy[1] - fw_xy[1]])
                target_vec = np.array([goal_xy[0] - bc_xy[0], goal_xy[1] - bc_xy[1]])
                theta, target_dir = get_angle_and_dir(car_vec, target_vec)
                dist = np.linalg.norm(target_dist_vec, ord=2)
                print(f"theta: {theta}, dir:{target_dir}, dist:{dist}")

                car_control_flag, is_reached = car_control(car_control_flag, theta, target_dir, dist, is_return)

                if is_reached:
                    print("到着")
                    mode = 6


        # フレームとマスク画像を表示
        # cv2.imshow("Mask", mask)
        cv2.namedWindow("Frame", cv2.WINDOW_NORMAL)
        cv2.imshow("Frame", frame)

        if mode <= 2:
            time.sleep(0.05)
        else:
            time.sleep(0.005)


        # qキーが押されたら途中終了
        # if cv2.waitKey(1) & 0xFF == ord('q'):
        #     break
        k = cv2.waitKey(10)

        if k == ord('q'):
            write_to_esp("s")
            break
        elif k == ord('r'):
            mode = 0
            detect_count = 0
            start_cnt = 0
            ret, bg = cap.read()
            bg = cv2.cvtColor(bg, cv2.COLOR_BGR2GRAY)
        elif k == ord('s'):
            mode = 1
            print("ゴミ検知を開始")
            bg = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    cap.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    main()