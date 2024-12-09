"use client";

import { CheckIcon, ClipboardIcon, LinkIcon } from "lucide-react";
import { Button, type ButtonProps } from "#/ui/button";
import { useCopyToClipboard } from "../../hooks/use-copy-clipboard";

interface CopyButtonProps extends ButtonProps {
    value: string;
    link?: boolean;
}

export function CopyButton({
    value,
    className,
    variant = "ghost",
    children = "Copy",
    link = false,
    ...props
}: CopyButtonProps) {
    const { isCopied, copyToClipboard } = useCopyToClipboard();

    return (
        <Button
            size="icon"
            variant={variant}
            className={className}
            onClick={() => {
                copyToClipboard(value);
            }}
            {...props}>
            {isCopied ? <CheckIcon /> : link ? <LinkIcon /> : <ClipboardIcon />}
            <span>{children}</span>
        </Button>
    );
}
