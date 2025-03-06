import { Peer, type DataConnection } from "peerjs";

export type Data = {
    fileName: string;
    fileSize: number;
    file: Blob;
};

type Subscriber =
    | {
          type: "data";
          cb: (data: Data[]) => void;
      }
    | {
          type: "close";
          cb: () => void;
      }
    | {
          type: "connected";
          cb: () => void;
      }
    | {
          type: "new_file";
          cb: () => void;
      }
    | {
          type: "new_file_end";
          cb: () => void;
      };

const FileReceiveKey = "new file will be send";

export class FileTransfer {
    private peer: Peer;
    private connection?: DataConnection;
    id?: string;
    dataList: Data[] = [];
    subscribers: Subscriber[] = [];

    constructor() {
        this.peer = new Peer();
    }

    initPeer() {
        return new Promise<string>((resolve, reject) => {
            this.peer.on("open", (id) => {
                resolve(id);
                this.id = id;
            });
            this.peer.on("error", (err) => {
                reject(err);
                console.error(err);
            });
            this.peer.on("close", () => {
                console.log("peer closed");
            });
        });
    }

    initConnection(
        connection: DataConnection,
        resolve?: (val: unknown) => void,
        reject?: (err: unknown) => void
    ) {
        this.connection = connection;
        this.connection.on("data", (data) => {
            if (data === FileReceiveKey) {
                this.dispatch("new_file");
            } else {
                this.onData(data as Data);
                this.dispatch("new_file_end");
            }
        });
        this.connection.on("close", () => {
            this.onConnectionClose();
        });
        this.connection.on("open", () => {
            if (resolve) {
                resolve("ok");
            }
        });
        this.connection.on("error", (err) => {
            if (reject) {
                reject(err);
            }
        });
    }

    async createRoom() {
        await this.initPeer();
        this.initConnection.bind(this);
        this.peer.on("connection", (conn) => {
            this.initConnection(conn);
            this.dispatch("connected");
        });
    }

    async joinRoom(roomId: string) {
        await this.initPeer();
        this.initConnection.bind(this);
        return new Promise((resolve, reject) => {
            this.connection = this.peer.connect(roomId);
            this.initConnection(this.connection, resolve, reject);
        });
    }

    sendFiles(files: FileList) {
        for (const file of files) {
            const data: Data = {
                fileName: file.name,
                fileSize: file.size,
                file: new Blob([file], { type: file.type })
            };
            if (this.connection) {
                this.connection.send(FileReceiveKey);
                this.connection.send(data);
            }
        }
    }

    onData(data: Data) {
        this.dataList.push(data);
        this.dispatch("data");
    }

    subscribe(option: Subscriber) {
        this.subscribers.push(option);
    }

    dispatch(type: Subscriber["type"]) {
        this.subscribers.forEach((sub) => {
            if (sub.type === type) {
                sub.cb(this.dataList);
            }
        });
    }

    onConnectionClose() {
        this.dispatch("close");
    }

    close() {
        if (this.connection) {
            this.connection.close();
        }
        this.peer.destroy();
        this.onConnectionClose();
    }
}
