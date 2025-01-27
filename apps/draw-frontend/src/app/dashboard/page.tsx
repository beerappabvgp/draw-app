"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useWebSocketContext } from "../hooks/webSocketHook";
import { useRoom } from "../hooks/useRoom";
import { useRoomContext } from "../hooks/useRoomContext";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [roomName, setRoomName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const { sendMessage } = useWebSocketContext();
  const router = useRouter();
  const { setRoomId } = useRoomContext();
  const { room, createRoom, error } = useRoom();


  const handleCreateRoom = async () => {
    if (roomName.trim()) {
      const response = await createRoom(roomName);
      if (response) {
        console.log("Room created:", room);
      }
    }
  };

  const handleJoinRoom = () => {
    if (joinRoomId.trim()) {
      sendMessage({ type: "join-room", roomId: joinRoomId });
      setRoomId(joinRoomId); // Store roomId in context
      console.log("Joined room:", joinRoomId);
      router.push("/canvas");
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in to access the dashboard.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Create Room Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Create Room</h2>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
          className="border rounded px-3 py-2 mr-2"
        />
        <button
          onClick={handleCreateRoom}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Room
        </button>
      </div>

      {/* Join Room Section */}
      <div>
        <button
          onClick={() => setShowJoinRoom((prev) => !prev)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mb-4"
        >
          {showJoinRoom ? "Cancel" : "Join Room"}
        </button>

        {showJoinRoom && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Join Room</h2>
            <input
              type="text"
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
              placeholder="Enter room ID"
              className="border rounded px-3 py-2 mr-2"
            />
            <button
              onClick={handleJoinRoom}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Join Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
