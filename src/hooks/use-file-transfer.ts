import { useEffect, useState } from "react";
import { FileTransfer } from "#/src/api/file-transfer";
import { useToast } from "#/src/hooks/use-toast";

export function useFileTransfer(roomId?: string) {
    const [transferIns, setTransferIns] = useState<FileTransfer>();
    const { toast, dismiss } = useToast();

    useEffect(() => {
        const ins = new FileTransfer();
        if (roomId) {
            setTimeout(() => {
                toast({
                    title: "正在连接...",
                    variant: "default"
                });
            }, 100);

            ins.joinRoom(roomId)
                .then(() => {
                    setTransferIns(ins);
                    toast({
                        title: "已连接！",
                        variant: "default"
                    });
                })
                .catch(() => {
                    setTimeout(() => {
                        toast({
                            title: "连接失败！",
                            description: "请检查网络连接后重试",
                            variant: "destructive"
                        });
                    }, 100);
                });
        } else {
            setTimeout(() => {
                toast({
                    title: "正在创建...",
                    variant: "default"
                });
            }, 100);
            ins.createRoom()
                .then(() => {
                    setTransferIns(ins);
                    toast({
                        title: "已创建房间",
                        variant: "default"
                    });
                })
                .catch(() => {
                    setTimeout(() => {
                        toast({
                            title: "创建失败！",
                            description: "请检查网络连接后重试",
                            variant: "destructive"
                        });
                    }, 100);
                });
        }
        ins.subscribe({
            type: "close",
            cb: () =>
                toast({
                    title: "当前连接已断开",
                    variant: "destructive"
                })
        });
        ins.subscribe({
            type: "connected",
            cb: () => {
                toast({
                    title: "有新的连接接入",
                    variant: "default"
                });
            }
        });
        ins.subscribe({
            type: "new_file",
            cb: () => {
                toast({
                    title: "正在接收新的文件...",
                    variant: "default"
                });
            }
        });
        ins.subscribe({
            type: "new_file_end",
            cb: () => {
                dismiss();
            }
        });
    }, [roomId, toast, dismiss]);

    return {
        transferIns
    };
}
