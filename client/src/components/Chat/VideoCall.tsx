/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import WrapperModal from "../WrapperModal";
import Avatar from "../Avatar";
import { Socket } from "socket.io-client";
import { User } from "../../types/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faPhone,
  faTimes,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface VideoCallProps {
  socket: Socket;
  currentChat: Chat | null;
  user: User | null;
  isCalling: boolean;
  setIsCalling: React.Dispatch<React.SetStateAction<boolean>>;
  canNotStart?: boolean;
  setCanNotStart: React.Dispatch<React.SetStateAction<boolean>>;
}

const VideoCall: React.FC<VideoCallProps> = ({
  socket,
  currentChat,
  user,
  isCalling,
  setIsCalling,
  canNotStart = false,
  setCanNotStart
}) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [iceCandidatesQueue, setIceCandidatesQueue] = useState<
    RTCIceCandidate[]
  >([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCameraOff, setIsCameraOff] = useState<boolean>(false);
  const [isIncomingCall, setIsIncomingCall] = useState<boolean>(false);
  const [isCallAccepted, setIsCallAccepted] = useState<boolean>(false);
  const [callerInfo, setCallerInfo] = useState<{
    callerId: string;
    callerName: string;
    callerAvatar: string;
  } | null>(null);
  const [savedChatId, setSavedChatId] = useState<string | null>(null);
  const [savedMembers, setSavedMembers] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(isCalling);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const startCall = async () => {
    if (!isMounted) return;

    try {
      console.log("Starting call...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      if (!peerConnectionRef.current) {
        const peerConnection = new RTCPeerConnection();
        stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("iceCandidate", {
              candidate: event.candidate,
              chatId: savedChatId || currentChat?._id,
              members: Array.isArray(currentChat?.members)
                ? currentChat.members
                : [],
            });
          }
        };

        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        peerConnectionRef.current = peerConnection;

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socket.emit("startCall", {
          chatId: currentChat?._id,
          userId: user?._id,
          userName: user?.fullname,
          userAvatar: user?.avatar,
          members: Array.isArray(currentChat?.members)
            ? currentChat.members
            : [],
          offer,
        });
      }
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    console.log(canNotStart);
    

    if (isCalling && !canNotStart) {
      startCall();
    }

    socket.on("incomingCall", handleIncomingCall);
    socket.on("callAnswered", handleCallAnswered);
    socket.on("callEnded", handleCallEnded);
    socket.on("iceCandidate", handleIceCandidate);
    socket.on("callRejected", handleCallRejected);

    return () => {
      socket.off("incomingCall", handleIncomingCall);
      socket.off("callAnswered", handleCallAnswered);
      socket.off("callEnded", handleCallEnded);
      socket.off("iceCandidate", handleIceCandidate);
      socket.off("callRejected", handleCallRejected);
    };
  }, [isCalling, socket, currentChat, isMounted]);

  const handleIncomingCall = async ({
    callerId,
    callerName,
    callerAvatar,
    offer,
    members,
    chatId,
    canNotAccept,
  }: {
    callerId: string;
    callerName: string;
    callerAvatar: string;
    offer: RTCSessionDescriptionInit;
    members: string[];
    chatId: string;
    canNotAccept: boolean;
  }) => {
    if (!isMounted) return;

    try {
      if (!canNotAccept) {
        setIsIncomingCall(true);
      } else {
        setIsIncomingCall(false);
      }
      setCallerInfo({ callerId, callerName, callerAvatar });
      setSavedChatId(chatId);
      setSavedMembers(members);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const peerConnection = new RTCPeerConnection();
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", {
            candidate: event.candidate,
            chatId,
            members,
          });
        }
      };

      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnectionRef.current = peerConnection;

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answerCall", {
        chatId,
        userId: user?._id,
        members,
        answer,
      });

      // Add queued ICE candidates
      for (const candidate of iceCandidatesQueue) {
        await peerConnection.addIceCandidate(candidate);
      }
      setIceCandidatesQueue([]);
    } catch (error) {
      console.error("Error handling incoming call:", error);
    }
  };

  socket.on("iceCandidate", (candidate) => {
    onIceCandidateReceived(candidate);
  });

  const onIceCandidateReceived = (candidate: RTCIceCandidate) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.addIceCandidate(candidate);
    } else {
      iceCandidatesQueue.push(candidate);
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidate) => {
    try {
      if (
        peerConnectionRef.current &&
        peerConnectionRef.current.remoteDescription
      ) {
        await peerConnectionRef.current.addIceCandidate(candidate);
      } else {
        setIceCandidatesQueue((prevQueue) => [...prevQueue, candidate]);
      }
    } catch (error) {
      console.error("Error handling ICE candidate:", error);
    }
  };

  const endCall = () => {
    try {
      console.log("Ending call...");
      socket.emit("endCall", {
        chatId: savedChatId || currentChat?._id,
        userId: user?._id,
        members:
          Array.isArray(savedMembers) && savedMembers.length > 0
            ? savedMembers
            : currentChat?.members,
      });

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        localVideoRef.current.srcObject = null;
      }

      if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
        const stream = remoteVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        remoteVideoRef.current.srcObject = null;
      }

      setIsCalling(false);
      setCanNotStart(false)
      setIsIncomingCall(false);
      setIsCallAccepted(false);
      setCallerInfo(null);
      console.log("Call ended successfully");
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  const handleCallAnswered = async ({
    answer,
  }: {
    answer: RTCSessionDescriptionInit;
  }) => {
    try {
      if (peerConnectionRef.current) {
        if (peerConnectionRef.current.signalingState === "stable") {
          console.warn("PeerConnection is already in stable state.");
          return;
        }
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
        setIsCallAccepted(true);

        // Add remote stream when call is accepted
        peerConnectionRef.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Add queued ICE candidates
        for (const candidate of iceCandidatesQueue) {
          await peerConnectionRef.current.addIceCandidate(candidate);
        }
        setIceCandidatesQueue([]);
      }
    } catch (error) {
      console.error("Error handling call answered:", error);
    }
  };

  const handleCallEnded = () => {
    try {
      console.log("Call ended by remote");
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        localVideoRef.current.srcObject = null;
      }

      if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
        const stream = remoteVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        remoteVideoRef.current.srcObject = null;
      }

      setIsCalling(false);
      setCanNotStart(false)
      setIsIncomingCall(false);
      setIsCallAccepted(false);
      setCallerInfo(null);
    } catch (error) {
      console.error("Error handling call ended:", error);
    }
  };

  const handleCallRejected = () => {
    try {
      console.log("Call rejected");
      endCall();
      setIsIncomingCall(false);
      alert("The call was rejected.");
    } catch (error) {
      console.error("Error handling call rejected:", error);
    }
  };

  const toggleMute = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsMuted(!isMuted);
      console.log("Microphone toggled:", !isMuted);
    }
  };

  const toggleCamera = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsCameraOff(!isCameraOff);
      console.log("Camera toggled:", !isCameraOff);
    }
  };

  const acceptCall = async () => {
    console.log("Call accepted");
    setIsIncomingCall(false);
    setIsCallAccepted(true);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const peerConnection = new RTCPeerConnection();
    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", {
          candidate: event.candidate,
          chatId: savedChatId || currentChat?._id,
          members:
            Array.isArray(savedMembers) && savedMembers.length > 0
              ? savedMembers
              : currentChat?.members,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current = peerConnection;

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("startCall", {
      chatId: savedChatId || currentChat?._id,
      userId: user?._id,
      members:
        Array.isArray(savedMembers) && savedMembers.length > 0
          ? savedMembers
          : currentChat?.members,
      offer,
      canNotAccept: true,
    });

    socket.on("remoteDescription", async (remoteDescription) => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(remoteDescription)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answerCall", {
        chatId: savedChatId || currentChat?._id,
        userId: user?._id,
        members:
          Array.isArray(savedMembers) && savedMembers.length > 0
            ? savedMembers
            : currentChat?.members,
        answer,
      });
    });

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("answerCall", {
      chatId: savedChatId || currentChat?._id,
      userId: user?._id,
      members:
        Array.isArray(savedMembers) && savedMembers.length > 0
          ? savedMembers
          : currentChat?.members,
      answer,
    });
  };

  const rejectCall = () => {
    console.log("Call rejected");
    const chatId = savedChatId || currentChat?._id;
    const members =
      Array.isArray(savedMembers) && savedMembers.length > 0
        ? savedMembers
        : currentChat?.members ?? [];

    if (chatId && members.length > 0) {
      socket.emit("rejectCall", {
        chatId,
        userId: user?._id,
        members,
      });
    }

    setIsIncomingCall(false);
    endCall();
  };

  return (
    <WrapperModal
      show={(isCalling || isIncomingCall) && isMounted}
      onClose={endCall}
      closeBtn={false}
    >
      <div className="video-call-container">
        {isIncomingCall ? (
          <div className="incoming-call">
            <Avatar
              user={{
                _id: callerInfo?.callerId || "",
                email: "",
                token: "",
                avatar: callerInfo?.callerAvatar || "",
                fullname: callerInfo?.callerName || "",
              }}
            />
            <h3>{callerInfo?.callerName} is calling...</h3>
            <div className="d-flex align-items-center justify-content-center gap-3">
              <button onClick={rejectCall} className="control-btn bg-danger">
                <FontAwesomeIcon icon={faTimes as IconProp} />
              </button>
              <button onClick={acceptCall} className="control-btn bg-success">
                <FontAwesomeIcon icon={faPhone as IconProp} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className={`local-video ${
                isCallAccepted ? "fullscreen" : "small"
              }`}
            />
            {isCallAccepted &&  (
              <video ref={remoteVideoRef} autoPlay className="remote-video" />
            )}
            <div className="controls">
              <button onClick={toggleMute} className="control-btn">
                {isMuted ? (
                  <FontAwesomeIcon icon={faMicrophoneSlash as IconProp} />
                ) : (
                  <FontAwesomeIcon icon={faMicrophone as IconProp} />
                )}
              </button>
              <button onClick={toggleCamera} className="control-btn">
                {isCameraOff ? (
                  <FontAwesomeIcon icon={faVideoSlash as IconProp} />
                ) : (
                  <FontAwesomeIcon icon={faVideo as IconProp} />
                )}
              </button>
              <button
                onClick={endCall}
                className="control-btn bg-danger cancel-call"
              >
                <FontAwesomeIcon icon={faPhone as IconProp} />
              </button>
            </div>
          </>
        )}
      </div>
    </WrapperModal>
  );
};

export default VideoCall;
