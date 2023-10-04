import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';

@Injectable()
export class PongService {
    private ballState = {
        x: 600,
        y: 350,
        radius: 5,
        dx: 1,
        dy: 1,
    };
    private leftPaddleState = {
        x: 10,
        y: 300,
        width: 10,
        height: 100,
        dy: 2,
    }
    private rightPaddleState = {
        x: 1180,
        y: 300,
        width: 10,
        height: 100,
        dy: 2,
    }

    private readonly logger = new Logger(PongService.name);
    private gameInterval: NodeJS.Timeout;

    getBallState() {
        this.logger.debug(this.ballState);
        return (this.ballState);
    }

    handlePaddleMovement(keycode: string) {
        if (keycode === "ArrowUp")
        {
            this.leftPaddleState.y -= this.leftPaddleState.dy * 10;
            if (this.leftPaddleState.y < 0) {
                this.leftPaddleState.y = 0;
            }
            this.logger.debug(this.leftPaddleState.y);
        }
        else if (keycode === "ArrowDown") {
            this.leftPaddleState.y += this.leftPaddleState.dy * 10;
            if (this.leftPaddleState.y + this.leftPaddleState.height > 700) {
                this.leftPaddleState.y = 700 - this.leftPaddleState.height;
            }
            this.logger.debug(this.leftPaddleState.y)
        }
    }

    resetBall() {
        this.ballState.x = 600;
        this.ballState.y = 350;
        this.ballState.dx = (Math.random() < 0.5 ? -1 : 1);
        this.ballState.dy = (Math.random() * 2 - 1);
    }

    adjustBallAngle(paddleY: number) {
        let relativeIntersectY = this.ballState.y - (paddleY + 50);
        let normalizedIntersectY = relativeIntersectY / (50);
        let bounceAngle = normalizedIntersectY * (45 * (Math.PI / 180));
    
        this.ballState.dy = 2 * Math.sin(bounceAngle);
    }

    startBroadcastingBallState(io: Server) {
        this.gameInterval = setInterval(() => {
            // Mettre à jour l'état de la balle ici 
            this.ballState.x += this.ballState.dx;
            this.ballState.y += this.ballState.dy;
            //collisions raquette gauche
            if (
                this.ballState.x - this.ballState.radius < this.leftPaddleState.x + this.leftPaddleState.width &&
                this.ballState.y + this.ballState.radius > this.leftPaddleState.y &&
                this.ballState.y - this.ballState.radius < this.leftPaddleState.y + this.leftPaddleState.height
            ) {
                this.ballState.dx = -this.ballState.dx;
                this.adjustBallAngle(this.leftPaddleState.y);
            }
            //collisions raquette droite
            if (
                this.ballState.x + this.ballState.radius > this.rightPaddleState.x &&
                this.ballState.y + this.ballState.radius > this.rightPaddleState.y &&
                this.ballState.y - this.ballState.radius < this.rightPaddleState.y + this.rightPaddleState.height
            ) {
                this.ballState.dx = -this.ballState.dx;
                this.adjustBallAngle(this.rightPaddleState.y);
            }

            //gere la collision des parois hautes et basses
            if (
             this.ballState.y + this.ballState.radius > 700 ||
             this.ballState.y - this.ballState.radius < 0
            ) {
               this.ballState.dy = -this.ballState.dy;
            }

            //reinitalisation pos this.ballState quand point marque
            if (this.ballState.x + this.ballState.radius > 1200)
            {
                this.logger.log('Joueur gauche a marque 1 Point !!!!!!!!!!!!');
                this.resetBall();
            }
            if (this.ballState.x + this.ballState.radius < 0)
            {
                this.logger.log('joueur droit a marque 1 Point !!!!!!!!!!!!');
                this.resetBall();
            }
            io.emit('ballState',this.ballState);
        }, 3); // met à jour toutes les 100 ms, à ajuster selon les besoins
    }
}
