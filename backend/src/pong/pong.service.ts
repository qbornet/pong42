import { Injectable, Logger } from '@nestjs/common';
import { initialize } from 'passport';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';

@Injectable()
export class PongService {
    private readonly logger = new Logger(PongService.name);
    
    private rooms = new Map<string, {
        ballState: any,
        paddlePlayer1: any,
        paddlePlayer2: any,
        scorePlayer1: number,
        scorePlayer2: number,
        gameInterval?: NodeJS.Timeout;
    }>();

    constructor() {};

    initializeRoom(roomName: string) {
        this.rooms.set(roomName, {
            ballState: {
                x: 600,
                y: 350,
                radius: 5,
                dx: 1,
                dy: 1,
            },
            paddlePlayer1: {
                x: 10,
                y: 300,
                width: 10,
                height: 100,
                dy: 2,
            },
            paddlePlayer2: {
                x: 1180,
                y: 300,
                width: 10,
                height: 100,
                dy: 2,
            },
            scorePlayer1: 0,
            scorePlayer2: 0
        });
    }

    checkVictory(roomName: string): string | null {
        const room = this.rooms.get(roomName);
        if (!room) return null;

        if (room.scorePlayer1 === 10) {
            return 'player1';
        } else if (room.scorePlayer2 === 10) {
            return 'player2';
        }
        return null;
    }

    getBallState(roomName: string) {
        const room = this.rooms.get(roomName);
        if (!room) return null;

        this.logger.debug(room.ballState);
        return (room.ballState);
    }

    handleKeyCode1(keycode: string, roomName: string) {
        const room = this.rooms.get(roomName);
        if (!room) return null;

        if (keycode === "ArrowUp")
        {
            room.paddlePlayer1.y -= room.paddlePlayer1.dy * 10;
            if (room.paddlePlayer1.y < 0) {
                room.paddlePlayer1.y = 0;
            }
            // this.logger.debug(this.paddlePlayer1.y);
        }
        else if (keycode === "ArrowDown") {
            room.paddlePlayer1.y += room.paddlePlayer1.dy * 10;
            if (room.paddlePlayer1.y + room.paddlePlayer1.height > 700) {
                room.paddlePlayer1.y = 700 - room.paddlePlayer1.height;
            }
            // this.logger.debug(this.paddlePlayer1.y)
        }
    }
    
    handleKeyCode2(keycode: string, roomName: string) {
        const room = this.rooms.get(roomName);
        if (!room) return null;

        if (keycode === "ArrowUp")
        {
            room.paddlePlayer2.y -= room.paddlePlayer2.dy * 10;
            if (room.paddlePlayer2.y < 0) {
                room.paddlePlayer2.y = 0;
            }
            // this.logger.debug(this.paddlePlayer2.y);
        }
        else if (keycode === "ArrowDown") {
            room.paddlePlayer2.y += room.paddlePlayer2.dy * 10;
            if (room.paddlePlayer2.y + room.paddlePlayer2.height > 700) {
                room.paddlePlayer2.y = 700 - room.paddlePlayer2.height;
            }
            // this.logger.debug(this.paddlePlayer2.y)
        }
    }
    
    resetBall(roomName: string) {
        const room = this.rooms.get(roomName);
        if (!room) return null;

        room.ballState.x = 600;
        room.ballState.y = 350;
        room.ballState.dx = (Math.random() < 0.5 ? -1 : 1);
        room.ballState.dy = (Math.random() * 2 - 1);
    }
    
    adjustBallAngle(paddleY: number, roomName: string) {
        const room = this.rooms.get(roomName);
        if (!room) return null;

        let relativeIntersectY = room.ballState.y - (paddleY + 50);
        let normalizedIntersectY = relativeIntersectY / (50);
        let bounceAngle = normalizedIntersectY * (45 * (Math.PI / 180));
        
        room.ballState.dy = 2 * Math.sin(bounceAngle);
    }
    
    startBroadcastingBallState(io: Server, rightPlayer: string, leftPlayer: string, roomName: string) {
        const room = this.rooms.get(roomName);
        if (!room) return null;

        room.gameInterval = setInterval(() => {
            // Mettre à jour l'état de la balle ici 
            room.ballState.x += room.ballState.dx;
            room.ballState.y += room.ballState.dy;
            //collisions raquette gauche
            if (
                room.ballState.x - room.ballState.radius < room.paddlePlayer1.x + room.paddlePlayer1.width &&
                room.ballState.y + room.ballState.radius > room.paddlePlayer1.y &&
                room.ballState.y - room.ballState.radius < room.paddlePlayer1.y + room.paddlePlayer1.height
                ) {
                    room.ballState.dx = -room.ballState.dx;
                    this.adjustBallAngle(room.paddlePlayer1.y, roomName);
                }
                //collisions raquette droite
                if (
                    room.ballState.x + room.ballState.radius > room.paddlePlayer2.x &&
                    room.ballState.y + room.ballState.radius > room.paddlePlayer2.y &&
                    room.ballState.y - room.ballState.radius < room.paddlePlayer2.y + room.paddlePlayer2.height
                    ) {
                        room.ballState.dx = -room.ballState.dx;
                        this.adjustBallAngle(room.paddlePlayer2.y, roomName);
                    }
                    
                    //gere la collision des parois hautes et basses
            if (
            room.ballState.y + room.ballState.radius > 700 ||
            room.ballState.y - room.ballState.radius < 0
            ) {
                room.ballState.dy = -room.ballState.dy;
            }
            
            //reinitalisation pos this.ballState quand point marque
            if (room.ballState.x + room.ballState.radius > 1200)
            {
                // this.logger.log('Joueur gauche a marque 1 Point !!!!!!!!!!!!');
                room.scorePlayer1++;
                io.to(roomName).emit('scorePlayer1', room.scorePlayer1)
                this.resetBall(roomName);
            }
            if (room.ballState.x + room.ballState.radius < 0)
            {
                // this.logger.log('joueur droit a marque 1 Point !!!!!!!!!!!!');
                room.scorePlayer2++;
                io.to(roomName).emit('scorePlayer2', room.scorePlayer2);
                this.resetBall(roomName);
            }
            const winner = this.checkVictory(roomName);
            if (winner) {
                clearInterval(room.gameInterval); //stop le jeu
                io.to(roomName).emit('gameOver',)
            }

            io.to(roomName).emit('ballState',room.ballState);
            io.to(rightPlayer).emit('paddleRight', room.paddlePlayer1);
            io.to(leftPlayer).emit('paddleLeft', room.paddlePlayer2);
        }, 3);
    }
}
