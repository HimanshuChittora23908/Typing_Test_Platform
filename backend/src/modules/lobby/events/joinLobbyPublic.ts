import type { DefaultEventProps } from '../../../types/DefaultEventProps';
import { SocketResponseType } from '../../../types/SocketResponseType';
import { createLobby, joinLobby, sendLobbyUpdate, getLatestLobby } from '../lobbyManager';
import { getGame } from '../../game/gameManager';

export default (props: DefaultEventProps, username: string): void => {
    const { socket } = props;

    if (!username.match(/^.{1,30}$/)) {
        socket.emit(SocketResponseType.LOBBY_ERROR_INCORRECT_USERNAME);
        return;
    }

    if (getGame(null) && !getGame(null)?.isFinished) {
        socket.emit(SocketResponseType.LOBBY_ERROR_GAME_ONGOING);
        return;
    }

    var lobby = getLatestLobby();

    if (!lobby) {
        createLobby();
        lobby = getLatestLobby();
        joinLobby(lobby ? lobby.lobbyId : '', socket.id, username);
    } else if (lobby.players.length >= lobby.maxPlayers) {
        createLobby();
        lobby = getLatestLobby();
        joinLobby(lobby ? lobby.lobbyId : '', socket.id, username);
    } else {
        joinLobby(lobby?.lobbyId, socket.id, username);
    }

    socket.join(lobby ? lobby.lobbyId : '');

    sendLobbyUpdate(props, lobby ? lobby.lobbyId : '');
};
