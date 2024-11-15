import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import './MeetingRoom.css'; // Ensure this is imported to apply CSS styles

function MeetingRoom() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const [callActive, setCallActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerInstance = useRef(null);
  const callInstance = useRef(null);
  const connectionInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer();
    peerInstance.current = peer;

    peer.on('open', (id) => {
      setPeerId(id);
      console.log('Peer ID: ', id);
    });

    peer.on('call', (call) => {
      console.log('Incoming call from: ', call.peer);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          call.answer(stream); // Automatically answer with local video/audio
          setCallActive(true);
          callInstance.current = call;

          call.on('stream', (remoteStream) => {
            if (remoteStream && remoteVideoRef.current) {
              console.log('Remote stream received');
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });

          call.on('close', () => {
            endCall();
          });
        })
        .catch((err) => {
          setErrorMessage('Failed to get local stream');
          console.error('Failed to get local stream', err);
        });
    });

    peer.on('connection', (conn) => {
      connectionInstance.current = conn;
      conn.on('data', (data) => {
        setChatMessages((prevMessages) => [...prevMessages, { sender: 'Remote', text: data }]);
      });
    });

    peer.on('error', (err) => {
      setErrorMessage('Error establishing peer connection');
      console.error('Peer error:', err);
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const initiateCall = () => {
    if (!remotePeerIdValue) {
      setErrorMessage('Please enter a remote Peer ID');
      return;
    }

    const remotePeerId = remotePeerIdValue;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        const call = peerInstance.current.call(remotePeerId, stream);
        setCallActive(true);
        callInstance.current = call;

        call.on('stream', (remoteStream) => {
          if (remoteStream && remoteVideoRef.current) {
            console.log('Remote stream received');
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        call.on('close', () => {
          endCall();
        });

        const conn = peerInstance.current.connect(remotePeerId);
        connectionInstance.current = conn;
        conn.on('data', (data) => {
          setChatMessages((prevMessages) => [...prevMessages, { sender: 'Remote', text: data }]);
        });
      })
      .catch((err) => {
        setErrorMessage('Failed to get local stream');
        console.error('Failed to get local stream', err);
      });
  };

  const endCall = () => {
    if (callInstance.current) {
      callInstance.current.close();
    }
    if (localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    if (remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCallActive(false);
    setRemotePeerIdValue('');
  };

  const sendMessage = () => {
    if (message.trim() && connectionInstance.current) {
      connectionInstance.current.send(message);
      setChatMessages((prevMessages) => [...prevMessages, { sender: 'You', text: message }]);
      setMessage('');
    }
  };

  return (
    <div className="meeting-room-container">
      <h2>Meeting Room</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="peer-info">
        <p>Your Peer ID: <strong>{peerId}</strong></p>
        <input
          type="text"
          placeholder="Enter remote Peer ID"
          value={remotePeerIdValue}
          onChange={(e) => setRemotePeerIdValue(e.target.value)}
          className="peer-id-input"
        />
        <button onClick={initiateCall} disabled={!remotePeerIdValue} className="start-call-btn">
          Start Call
        </button>
        {callActive && (
          <button onClick={endCall} className="end-call-btn">
            End Call
          </button>
        )}
      </div>

      <div className="video-container">
        <div className="video-box">
          <h3>Your Video</h3>
          <video ref={localVideoRef} autoPlay muted className="video-player" />
        </div>
        {callActive && (
          <div className="video-box">
            <h3>Remote Video</h3>
            <video ref={remoteVideoRef} autoPlay className="video-player" />
          </div>
        )}
      </div>

      {callActive && (
        <div className="chat-container">
          <h3>Chat</h3>
          <div className="chat-box">
            {chatMessages.map((msg, index) => (
              <p key={index} className={`chat-message ${msg.sender === 'You' ? 'you' : 'remote'}`}>
                <strong>{msg.sender}:</strong> {msg.text}
              </p>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="chat-input"
          />
          <button onClick={sendMessage} className="send-btn">Send</button>
        </div>
      )}
    </div>
  );
}

export default MeetingRoom;
