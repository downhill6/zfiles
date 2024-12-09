import { Link, Outlet } from "react-router";
import { Toaster } from "#/ui/toaster";

const Layout = () => {
    return (
        <>
            <main className="flex flex-col justify-between min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <Outlet />
                <footer className="py-8 px-4 text-center text-gray-500 text-sm">
                    <span>Built by </span>
                    <Link
                        to="https://github.com/downhill6"
                        className="underline"
                        target="_blank">
                        downhill6
                    </Link>
                    <span>. The source code is available on </span>
                    <Link
                        to="https://github.com/downhill6/zfile"
                        className="underline"
                        target="_blank">
                        Github
                    </Link>
                    <span>.</span>
                </footer>
            </main>
            <Toaster />
        </>
    );
};

export default Layout;
