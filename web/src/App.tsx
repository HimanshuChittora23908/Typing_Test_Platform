import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styles from './styles/App.module.scss';
import type { LobbyState } from './type/LobbyState';
import type { GameState } from './type/GameState';
import { SocketResponseType } from './type/SocketResponseType';
import JoinLobby from './components/JoinLobby';
import Lobby from './components/Lobby';
import Game from './components/Game';
import '../index.css';

export const socket = io(import.meta.env.VITE_SOCKET_ENDPOINT ?? '');

export const GameStateContext = createContext<GameState | null>(null);
export const LobbyStateContext = createContext<LobbyState | null>(null);

const App: React.FC = () => {
    const [lobbyState, setLobbyState] = useState<LobbyState | null>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);

    useEffect(() => {
        socket.on(SocketResponseType.LOBBY_UPDATE, (lobbyState: LobbyState) => setLobbyState(lobbyState));
        socket.on(SocketResponseType.GAME_UPDATE, (gameState: GameState) => setGameState(gameState));
    }, []);

    return (
        <div>
            <LobbyStateContext.Provider value={lobbyState}>
                <GameStateContext.Provider value={gameState}>
                    {!gameState && !lobbyState && <JoinLobby />}
                    {(!gameState || gameState.isFinished) && lobbyState && <Lobby />}
                    {gameState && !gameState.isFinished && <Game />}
                </GameStateContext.Provider>
            </LobbyStateContext.Provider>
            {/* <div className='text-white text-3xl'></div> */}
        </div>
    );
};

export default App;
