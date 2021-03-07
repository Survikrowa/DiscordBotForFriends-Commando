import type { Message, MessageReaction } from 'discord.js';

export type GetCommandWithoutPrefix = (message: Message) => CommandWithoutPrefix;

export type CommandWithoutPrefix = {
  title: string;
  run: () => Promise<Message | MessageReaction> | void | Promise<void>;
};

export type CommandsWithoutPrefixes = (message: Message) => CommandWithoutPrefix[];
