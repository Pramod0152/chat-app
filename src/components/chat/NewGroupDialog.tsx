import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Check, Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getUsersApi } from '@/api/user.api';
import { createConversationApi } from '@/api/conversation.api';
import { useAuthStore } from '@/store/auth.store';
import { useChatStore } from '@/store/chat.store';
import type { User } from '@/types/auth.types';

interface NewGroupDialogProps {
  trigger?: React.ReactNode;
}

export function NewGroupDialog({ trigger }: NewGroupDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const currentUser = useAuthStore((state) => state.user);
  const setActiveConversationId = useChatStore((state) => state.setActiveConversationId);

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsersApi(),
    enabled: open,
  });

  const users = usersResponse?.data ?? [];
  const filteredUsers = users.filter(
    (user) =>
      user.id !== currentUser?.id &&
      user.username.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prev) =>
      prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  const removeUser = (userId: number) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0 || !currentUser) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCreating(true);
    try {
      const response = await createConversationApi({
        type: 'Group',
        participant_ids: selectedUsers.map((u) => u.id),
        group_name: groupName.trim(),
        group_image: groupImage.trim() || undefined,
      });

      toast.success('Group created successfully');
      setActiveConversationId(response.data.id);
      setOpen(false);
      setGroupName('');
      setGroupImage('');
      setSelectedUsers([]);
      setSearch('');
    } catch (error) {
      toast.error('Failed to create group');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name *</Label>
            <Input
              id="group-name"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-image">Group Image URL (optional)</Label>
            <Input
              id="group-image"
              placeholder="https://example.com/image.jpg"
              value={groupImage}
              onChange={(e) => setGroupImage(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Participants *</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-sm"
                >
                  <span>{user.username}</span>
                  <button
                    onClick={() => removeUser(user.id)}
                    className="text-sky-600 hover:text-sky-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <ScrollArea className="h-[200px] pr-4">
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
                    onClick={() => toggleUserSelection(user)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-slate-50 ${
                      selectedUsers.find((u) => u.id === user.id)
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
                    {selectedUsers.find((u) => u.id === user.id) && (
                      <Check className="h-5 w-5 text-sky-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
          <Button
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedUsers.length === 0 || isCreating}
            className="w-full"
          >
            {isCreating ? 'Creating...' : 'Create Group'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
