import { ThemeButton } from "#/ui/theme-button";
import { Card, CardContent, CardHeader, CardTitle } from "#/ui/card";
import { Input } from "#/ui/input";
import { Separator } from "#/ui/separator";
import { Button } from "#/ui/button";
import { Plus, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export function Home() {
    const [roomId, setRoomId] = useState("");
    const navigate = useNavigate();

    const joinRoom = () => {
        if (roomId) {
            navigate(`/room/${roomId}`);
        }
    };

    const createRoom = () => {
        navigate("/room");
    };

    return (
        <div>
            <header className="flex items-center bg-background shadow-sm h-14 border-b-border">
                <div className="container mx-auto flex justify-between px-2">
                    <div className="flex items-center justify-between">
                        <img className='w-7 h-7' src="/logo.webp" alt="logo" />
                        <p className="text-xs pl-4 text-gray-600 dark:text-gray-300 font-medium">
                            创建或加入房间，即刻分享文件
                        </p>
                    </div>
                    <ThemeButton />
                </div>
            </header>
            <div className="mt-6 flex justify-center">
                <Card className="md:w-[500px] w-[350px]">
                    <CardHeader>
                        <CardTitle className="text-center">
                            还未加入任何房间
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <Button className="w-60" onClick={createRoom}>
                            <Plus />
                            创建房间
                        </Button>
                        <Separator className="my-6 w-60 relative after:content-['OR'] after:bg-background after:absolute after:scale-75 after:-translate-y-1/2 after:-translate-x-1/2 after:left-1/2 after:p-2"></Separator>
                        <Input
                            className="w-60 mb-2"
                            placeholder="请输入房间 ID"
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <Button
                            onClick={joinRoom}
                            variant="outline"
                            className="w-60"
                            disabled={roomId === ""}>
                            <UserRoundPlus />
                            加入房间
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
