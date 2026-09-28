"use client";

import React from "react";
import emojis from "../data/discord-emojis.json";

type Props = {
  children: string;
  className?: string;
};

export default function DiscordEmojiText({
  children,
  className = "",
}: Props) {
  const parts = children.split(/(:[A-Za-z0-9_]+:)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const match = part.match(/^:([A-Za-z0-9_]+):$/);

        if (!match) {
          return <React.Fragment key={index}>{part}</React.Fragment>;
        }

        const emoji = emojis[match[1] as keyof typeof emojis];

        if (!emoji) {
          return <React.Fragment key={index}>{part}</React.Fragment>;
        }

        return (
          <img
            key={index}
            src={emoji.url}
            alt={`:${emoji.name}:`}
            title={`:${emoji.name}:`}
            className="inline-block h-[1.25em] w-[1.25em] align-[-0.2em] object-contain"
          />
        );
      })}
    </span>
  );
}
