export function SkeletonConversation() {
  return (
    <div className="flex animate-pulse items-center gap-3 p-3">
      <div className="bg-muted h-10 w-10 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="bg-muted h-3 w-2/3 rounded" />
        <div className="bg-muted h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}
