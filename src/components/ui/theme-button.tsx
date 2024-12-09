import { Sun, Moon } from "lucide-react";
import { Button } from "#/ui/button";
import { useTheme } from "../theme-provider";

export const ThemeButton = () => {
    const { theme, setTheme } = useTheme();

    const onClick = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <Button size="icon" variant="ghost" onClick={onClick}>
            {theme === "light" ? <Moon /> : <Sun />}
        </Button>
    );
};
