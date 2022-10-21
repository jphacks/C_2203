from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key'

socketio = SocketIO(app, cors_allowed_origins='*')

# 命令を受け取るページ
# @app.route('/')
# def index():
#     return render_template('index.html')

# /animateにアクセスが来たら命令を送る
@app.route('/animate/walk')
def walk():
    socketio.emit('walk', "walk request")
    return "walk event is requested."

@app.route('/animate/stop')
def stop():
    socketio.emit('stop', "stop request")
    return "stop event is requested."

@app.route('/animate/catch')
def catch():
    socketio.emit('catch', "catch request")
    return "catch event is requested."

@app.route('/animate/release')
def release():
    socketio.emit('release', "release request")
    return "release event is requested."

if __name__ == '__main__':
    socketio.run(app, debug=True)