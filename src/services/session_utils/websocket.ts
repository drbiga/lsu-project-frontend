export default function createWebSocket(): WebSocket {
    const socket = new WebSocket(`ws://localhost:8000/sessions/ws`); // Replace with your actual WebSocket URL
    
    socket.onopen = () => {
      console.log('WebSocket connection established.');
    };
    
    socket.onclose = (event) => {
        if (event.wasClean) {
            console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
        } else {
            console.error('WebSocket connection closed unexpectedly');
        }
    };
    
    socket.onerror = (error) => {
        console.error(`WebSocket error: ${error}`);
    };

    return socket;
}
