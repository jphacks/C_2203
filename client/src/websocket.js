const URL = "";
export default function websocketInit(actionFn) {
  const socket = new WebSocket(URL);

  socket.onopen = () => {
    socket.send("connected");
  };

  socket.onmessage = (msgEvent) => {
    actionFn(msgEvent.data);
  };

  socket.onclose = (e) => {
    console.log(`closed websocket because of ${e.reason}`);
  };

  socket.onerror = (e) => {
    console.error(`websocket error ${e}`);
  };
}
