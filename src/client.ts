import * as vscode from 'vscode';
import net from 'net'
import ip from 'ip'
import { Util } from './utils';



export class Client extends Util {
    // private connection: net.Socket
    public readonly HOST: string
    public readonly PORT: number
    public readonly HOST_SECRET: string
    public readonly CLIENT_SECRET: string
    private messageCounter: number = 0
    private con: string[] = []

    constructor(host: string, port: number, hostSecret: string, clientSecret: string) {
        super();
        this.HOST = host
        this.PORT = port
        this.HOST_SECRET = hostSecret
        this.CLIENT_SECRET = clientSecret
        // this.connection = net.createConnection({ port: this.PORT, host: this.HOST }, () => { });
        this.findHosts()
    }

    createConnection(): void {
        // vscode.window.showInformationMessage('Connecting to Local Network');

        // this.connection.on('data', (data) => {
        //     if (this.messageCounter < 1) {
        //         if (data.toString() === this.HOST_SECRET) {
        //             this.connection.write(this.CLIENT_SECRET)
        //             this.messageCounter++
        //             return
        //         } else this.connection.destroy()
        //     }
        //     vscode.window.showInformationMessage(data.toString())
        //     // vscode.window.showInputBox({ title: "Enter Message" }).then(msg => {
        //     //     if (msg) client.write(this.HOST + ": " + msg)
        //     // })
        //     // console.log("message recieved from server ",data.toString());
        //     //client.end(); 
        // });
        // this.connection.on('end', () => {
        //     // console.log(HOST + ' : disconnected from the server.');
        // })
        // this.connection.on('error', () => {
        //     vscode.window.showErrorMessage('Unable to Connect IP');
        // })
    }

    getAddressRange(): { start: number; end: number, prefix: string } | undefined {
        try {
            let cidr = this.getIpDetails().cidr!
            const range = ip.cidrSubnet(cidr); // get range
            return { start: +range.firstAddress.split(".").slice(-1), end: +range.lastAddress.split(".").slice(-1), prefix: range.firstAddress.split(".").slice(0, -1).join(".") }
        } catch (error) {
            vscode.window.showErrorMessage("Please make sure, You're Connected to a WLAN Network")
            return undefined
        }
    }

    async findHosts(): Promise<any> {
        let addressDetails = this.getAddressRange()
        var connections: net.Socket[] = []
        if (addressDetails) {
            let i = addressDetails.start
            while (i <= addressDetails.end) {

                let con = await this.tryConnection(addressDetails.prefix + "." + i)
                console.log(con?.closed, con?.destroyed, con?.pending)

                // console.log(addressDetails.prefix + "." + i)

                // await client.on('error', () => { 
                //     throw("Error")
                // })

                // let d = await new Promise((res, rej) => {
                //     try {
                // client.on('data', (data: any) => {
                // console.log(addressDetails)
                // this.con.push(data.toString())
                // return data.toString()
                // if (data.toString() === this.HOST_SECRET) connections.push(client)
                // return client
                // });

                i++
            }
            // console.log(connections)
        }
    }

    async tryConnection(host: string): Promise<any> {
        return new Promise((res, rej) => {
            let client = net.createConnection({ port: this.PORT, host: host }, () => {});
            client.on('error', () => { rej(undefined) })
            client.on('data',()=>{
                res(client)
            })
        })
    }

    closeConnection(): void {
        // this.connection.destroy()
    }
}