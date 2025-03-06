import { ThemeButton } from "#/ui/theme-button";
import { useParams, useNavigate } from "react-router";
import { LogOut, FileUp, FileChartColumn } from "lucide-react";
import { Card, CardContent, CardTitle } from "#/ui/card";
import { Button } from "#/ui/button";
import { CopyButton } from "#/ui/copy-button";
import { useEffect, useRef, useState } from "react";
import { useFileTransfer } from "#/src/hooks/use-file-transfer";
import { FileTransfer, type Data } from "#/src/api/file-transfer";
import { byteToSize } from "#/lib/byte-to-size";
import download from "js-file-download";
import { useToast } from "#/src/hooks/use-toast";
import logoUrl from '#/logo.webp'
import QRcode from "qrcode";

function RoomInfoCard({ roomId }: { roomId?: string }) {
    const link = location.host + "/room/" + roomId;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    if (roomId) {
        console.log(link);
        QRcode.toCanvas(canvasRef.current, link, {
            width: 200,
            color: {
                dark: "#000000",
                light: "#ffffff"
            },
        });
    }

    return (
        <Card className="pt-2 pb-4 sm:max-w-80 sm:ml-6 ">
            <CardTitle className="text-base flex p-6 py-2 justify-between items-center">
                <div>当前房间</div>
            </CardTitle>
            <CardContent className="flex py-0 pb-2 justify-center">
                <canvas className="flex " width={200} height={200} ref={canvasRef}></canvas>
            </CardContent>
            <CardContent className="flex flex-col py-0 pb-2 items-end">
                <div className="w-full border font-mono text-xs truncate flex items-center">
                    <CopyButton
                        value={link}
                        size="sm"
                        variant="default"
                        link>
                        Copy
                    </CopyButton>
                    <div>
                        {roomId ? link : ""}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function UploadCard({
    transferIns
}: {
    transferIns: FileTransfer | undefined;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    const onFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            transferIns?.sendFiles(files);
        }
    };

    const onClick = () => {
        inputRef.current?.click();
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target?.files;
        onFileChange(files);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer?.files;
        onFileChange(files);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <Card className="flex-1 max-sm:mt-2 flex">
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                className="m-6 p-2 flex-1 flex flex-col items-center justify-center border-dashed border-2 border-gray-600 rounded-md max-sm:border-none">
                <FileUp size={48} className="max-sm:hidden" />
                <span className="m-2 text-gray-600 max-sm:hidden">
                    拖拽文件到这里上传
                </span>
                <Button onClick={onClick} className="w-60">
                    上传文件
                </Button>
                <input
                    className="hidden"
                    ref={inputRef}
                    type="file"
                    onChange={onInputChange}
                />
            </div>
        </Card>
    );
}

function FileListCard({
    transferIns
}: {
    transferIns: FileTransfer | undefined;
}) {
    const [datalist, setDatalist] = useState<Data[]>([]);
    useEffect(() => {
        transferIns?.subscribe({
            type: "data",
            cb: (data: Data[]) => setDatalist([...data])
        });
    }, [transferIns]);

    const handleDownload = (data: Data) => {
        download(data.file || "", data.fileName || "fileName");
    };

    return (
        <div className="container mx-auto mt-4 px-2">
            <Card className="min-h-[164px]">
                <CardTitle className="text-base flex p-6 py-4 justify-between items-center">
                    <div className="text-sm">已接收文件</div>
                </CardTitle>
                {datalist.length === 0 ? (
                    <div className="pb-10 flex justify-center flex-col items-center dark:text-[#D1D5DB] text-[#D1D5DB]">
                        <FileChartColumn size={48} />
                        <span className="text-sm mt-1">暂无文件</span>
                    </div>
                ) : (
                    <CardContent>
                        {datalist.map((data, index) => (
                            <div
                                key={index}
                                className="flex p-2 px-4 items-center justify-between bg-[#F9FAFB] dark:bg-[#374151] rounded-md mb-2">
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm">
                                        {data.fileName}
                                    </span>
                                    <span className="text-xs font-medium">
                                        {byteToSize(data.fileSize)}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownload(data)}>
                                    下载
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                )}
            </Card>
        </div>
    );
}

export function Room() {
    const { roomId } = useParams();
    const { transferIns } = useFileTransfer(roomId);
    const navigate = useNavigate();
    const { dismiss } = useToast();

    const onLeave = () => {
        transferIns?.close();
        navigate(-1);
        dismiss();
    };

    return (
        <div>
            <header className="flex items-center bg-background shadow-sm h-14 border-b-border">
                <div className="container mx-auto flex justify-between px-2 items-center">
                    <img className='w-7 h-7' src={logoUrl} alt="logo" />
                    <div className="flex items-center justify-between">
                        <Button
                            size="sm"
                            variant="outline"
                            className="mr-4"
                            onClick={onLeave}>
                            <LogOut size="20" absoluteStrokeWidth />
                            退出
                        </Button>
                        <ThemeButton />
                    </div>
                </div>
            </header>
            <div className="container mx-auto flex justify-between px-2 mt-6 max-sm:flex-col-reverse max-sm:mt-2">
                <UploadCard transferIns={transferIns} />
                {roomId ? null : <RoomInfoCard roomId={transferIns?.id} />}
            </div>
            <FileListCard transferIns={transferIns} />
        </div>
    );
}
