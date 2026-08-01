import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Shield, Crown } from 'lucide-react';

import { AddUserToGroupDialog } from '@/components/chat/AddUserToGroupDialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getParticipantsByConversationIdApi } from '@/api/participant.api';
import { getConversationByIdApi } from '@/api/conversation.api';
import { useAuthStore } from '@/store/auth.store';
import type { Participant } from '@/types/chat.types';

export function GroupDetailPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const conversationIdNum = conversationId ? parseInt(conversationId, 10) : 0;

  const { data: conversationData, isLoading: conversationLoading } = useQuery({
    queryKey: ['conversation', conversationIdNum],
    queryFn: () => getConversationByIdApi(conversationIdNum),
    enabled: !!conversationIdNum,
  });

  const { data: participantsData, isLoading: participantsLoading } = useQuery({
    queryKey: ['participants', conversationIdNum],
    queryFn: () => getParticipantsByConversationIdApi(conversationIdNum),
    enabled: !!conversationIdNum,
  });

  const conversation = conversationData?.data;
  const participants = participantsData?.data ?? [];
  const isAdmin = conversation?.admin_id === currentUser?.id;

  if (conversationLoading || participantsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {conversation.group_image ? (
              <img
                src={conversation.group_image}
                alt={conversation.group_name || 'Group'}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-white font-semibold text-lg">
                {conversation.group_name?.charAt(0).toUpperCase() || 'G'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-bold">{conversation.group_name || 'Group'}</h1>
              <p className="text-sm text-muted-foreground">{participants.length} members</p>
            </div>
          </div>
          {isAdmin && (
            <AddUserToGroupDialog conversationId={conversationIdNum} />
          )}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-4">
          <div className="mb-6">
            <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Group Members
            </h2>
            <Separator className="mb-4" />
            <div className="space-y-3">
              {participants.map((participant: Participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 rounded-lg border p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-white font-semibold">
                    {participant.user?.username.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {participant.user?.username || 'Unknown'}
                    </p>
                    {participant.is_admin && (
                      <span className="ml-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Crown className="h-3 w-3" />
                        Admin
                      </span>
                    )}
                  </div>
                  {participant.user_id === currentUser?.id && (
                    <span className="text-xs text-muted-foreground">You</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isAdmin && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-2 text-sm font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Controls
              </h3>
              <p className="text-sm text-muted-foreground">
                As the group admin, you can add new members to this group using the "Add User" button above.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
