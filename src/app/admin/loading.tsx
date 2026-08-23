import { Loader2 } from "lucide-react";

// /admin is entirely dynamic (every page reads the session via
// requireAdmin()), so without this the router has nothing to show between
// tapping a top-nav tab and the server responding — on a slow connection
// that gap reads as the page doing nothing, then suddenly snapping to the
// new tab, which looks like a flash/close/reopen. This fills that gap
// immediately; the header and AdminTopNav above stay mounted and
// interactive the whole time (see the linking-and-navigating Next.js docs
// on dynamic routes without loading.tsx).
export default function AdminLoading() {
  return (
    <div className="flex flex-1 items-center justify-center py-24 text-muted-foreground">
      <Loader2 className="size-6 animate-spin" />
    </div>
  );
}
