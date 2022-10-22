from flask import Flask, render_template, request
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key'

socketio = SocketIO(app, cors_allowed_origins='*')

# 命令を受け取るページ
@app.route('/')
def index():
    return render_template('index.html')

# demoページ
@app.route('/demo')
def demo():
    return render_template('demo.html')

# /animateにアクセスが来たら命令を送る
# クエリパラーメータはqで値は['stop', 'walk', 'stop_with_ball', 'walk_with_ball']のいずれか
@app.route('/animate', methods=['GET'])
def animate():
    q = request.args.get("q")
    socketio.emit('animate', q, broadcast=True)
    return "animation succeeded"

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', debug=True, port=8000)
