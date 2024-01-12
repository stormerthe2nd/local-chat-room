import * as vscode from 'vscode';
import net from 'net'
import { Util } from './utils';



export class Host extends Util {
    private server: net.Server
    private connectedSockets: net.Socket[] = []
    public readonly HOST: string
    public readonly PORT: number
    public readonly HOST_SECRET: string
    public readonly CLIENT_SECRET: string

    constructor(port: number, hostSecret: string, clientSecret: string) {
        super()

        this.HOST = this.getIpDetails().address
        this.PORT = port
        this.HOST_SECRET = hostSecret
        this.CLIENT_SECRET = clientSecret

        this.server = net.createServer()
        this.server.on('error', this.onServerErrorHandler);
        this.server.on("connection", this.onServerConnectionHandler);
        this.setHostListener()
    }

    setHostListener(): void {
        this.server.listen(this.PORT, this.HOST, () => {
            let address: net.AddressInfo = this.server.address() as net.AddressInfo;
            vscode.window.showInformationMessage('Hosted Server on ' + this.HOST + ":" + address.port);
            // console.log('opened server on ', address);
        });
    }

    onServerConnectionHandler(socket: net.Socket): void {
        this.connectedSockets.push(socket)
        socket.write(this.HOST_SECRET)  //  on connection exchange secret

        socket.on('data', (data) => {
            if (data.toString() === this.CLIENT_SECRET) {
                socket.write('SERVER: Connection Established')
                return
            }
            this.broadcast(data.toString())
        });
        socket.once("close", () => {
            let index = this.connectedSockets.indexOf(socket);
            if (index !== -1) {
                // console.log(sockets.length);
                this.connectedSockets.splice(index, 1);
                // console.log(sockets.length);
            }

        });
        socket.on("error", (err: any) => {
            console.log("client connection got errored out.", err)
        });
    }

    onServerErrorHandler(err: any): void {
        if (err.code === 'EADDRINUSE') {
            console.log('Address in use, retrying...');
            setTimeout(() => {
                this.server.close();
                // server.listen(PORT, HOST);
            }, 1000);
        } else {
            this.server.close();
            // console.log("server error", err)
        }
    }

    broadcast(msg: string): void {
        this.connectedSockets.forEach((client) => { client.write(msg); });
    }

    stopServer():void{
        this.server.close();
    }

}