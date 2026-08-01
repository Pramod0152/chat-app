import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Check, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getUsersNotInPrivateConversationApi } from '@/api/user.api';
import { createConversationApi } from '@/api/conversation.api';
import { useAuthStore } from '@/store/auth.store';
import { useChatStore } from '@/store/chat.store';
import type { User } from '@/types/auth.types';

interface NewChatDialogProps {
  trigger?: React.ReactNode;
}

export function NewChatDialog({ trigger }: NewChatDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const currentUser = useAuthStore((state) => state.user);
  const setActiveConversationId = useChatStore((state) => state.setActiveConversationId);

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['users-not-in-private'],
    queryFn: () => getUsersNotInPrivateConversationApi({ limit: 50 }),
    enabled: open,
  });

  const users = usersResponse?.data ?? [];
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateChat = async () => {
    if (!selectedUser || !currentUser) return;

    setIsCreating(true);
    try {
      const response = await createConversationApi({
        type: 'Private',
        participant_ids: [selectedUser.id],
      });

      toast.success('Chat created successfully');
      setActiveConversationId(response.data.id);
      setOpen(false);
      setSelectedUser(null);
      setSearch('');
    } catch (error) {
      toast.error('Failed to create chat');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <ScrollArea className="h-[300px] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">
                  {search ? 'No users found' : 'No users available'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-slate-50 ${
                      selectedUser?.id === user.id
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-white font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{user.username}</p>
                    </div>
                    {selectedUser?.id === user.id && (
                      <Check className="h-5 w-5 text-sky-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
          <Button
            onClick={handleCreateChat}
            disabled={!selectedUser || isCreating}
            className="w-full"
          >
            {isCreating ? 'Creating...' : 'Start Chat'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
