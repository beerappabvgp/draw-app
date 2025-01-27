// /components/RoomActions.tsx
import React, { useState } from 'react';
import { useRoom } from '../hooks/useRoom';

export const RoomActions = () => {
  const [roomName, setRoomName] = useState<string>('');
  const [roomIdToJoin, setRoomIdToJoin] = useState<string>('');
  const { room, createRoom, error } = useRoom();

  const handleCreateRoom = async () => {
    if (roomName.trim() === '') return;
    const message = await createRoom(roomName); 
  };

  const handleJoinRoom = () => {
    if (!roomIdToJoin.trim()) return;
    // Logic to join the room (you can redirect or show room details here)
    alert(`Joining Room ID: ${roomIdToJoin}`);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div>
        <input
          type="text"
          placeholder="Enter Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="p-2 border border-gray-300"
        />
        <button
          onClick={handleCreateRoom}
          className="mt-2 p-2 bg-blue-500 text-white"
        >
          Create Room
        </button>
      </div>

      {room && (
        <div className="mt-4">
          <p>Room Created! Room ID: {room.roomId}</p>
        </div>
      )}

      <div>
        <input
          type="text"
          placeholder="Enter Room ID to Join"
          value={roomIdToJoin}
          onChange={(e) => setRoomIdToJoin(e.target.value)}
          className="p-2 border border-gray-300"
        />
        <button
          onClick={handleJoinRoom}
          className="mt-2 p-2 bg-green-500 text-white"
        >
          Join Room
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};
