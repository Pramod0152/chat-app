import type { Conversation } from '@/types/chat.types';

function toProperCase(value: string): string {
  return value
    .split(' ')
    .map((word) =>
      word.length > 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word,
    )
    .join(' ');
}

export function getConversationDisplayName(conversation: Conversation): string {
  if (conversation.type === 'Private') {
    const username = conversation.participants?.[0]?.user?.username;
    return username ? toProperCase(username) : 'Unknown';
  }
  return conversation.group_name ?? 'Group';
}
