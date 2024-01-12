import os from 'os'

export class Util {

    getIpDetails(): os.NetworkInterfaceInfo {
        return Object.values(os.networkInterfaces()).flat().filter(network => network?.family === 'IPv4' && network.address !== '127.0.0.1')[0]!; // get current ip info
    }

}
