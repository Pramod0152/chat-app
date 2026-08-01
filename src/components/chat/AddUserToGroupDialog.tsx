import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Check, Search, UserPlus } from 'lucide-react';

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
import { getUsersNotInGroupConversationApi } from '@/api/user.api';
import { createParticipantApi } from '@/api/participant.api';
import { useAuthStore } from '@/store/auth.store';
import type { User } from '@/types/auth.types';

interface AddUserToGroupDialogProps {
  conversationId: number;
  trigger?: React.ReactNode;
}

export function AddUserToGroupDialog({ conversationId, trigger }: AddUserToGroupDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const currentUser = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['users-not-in-group', conversationId],
    queryFn: () => getUsersNotInGroupConversationApi(conversationId, { limit: 50 }),
    enabled: open,
  });

  const users = usersResponse?.data ?? [];
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = async () => {
    if (!selectedUser || !currentUser) return;

    setIsAdding(true);
    try {
      await createParticipantApi({
        conversation_id: conversationId,
        user_id: selectedUser.id,
      });

      toast.success('User added to group successfully');
      setOpen(false);
      setSelectedUser(null);
      setSearch('');
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['users-not-in-group', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['participants', conversationId] });
    } catch (error) {
      toast.error('Failed to add user to group');
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User to Group</DialogTitle>
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
                  {search ? 'No users found' : 'No users available to add'}
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
            onClick={handleAddUser}
            disabled={!selectedUser || isAdding}
            className="w-full"
          >
            {isAdding ? 'Adding...' : 'Add to Group'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
