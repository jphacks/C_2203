from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key'

socketio = SocketIO(app, cors_allowed_origins='*')

# 命令を受け取るページ
@app.route('/')
def index():
    return render_template('index.html')

# /animateにアクセスが来たら命令を送る
@app.route('/animate')
def animate():
    socketio.emit('animate', "Animate event is requested.")
    return "Animate event is requested."

if __name__ == '__main__':
    socketio.run(app, debug=True)