type LeaveRouter = {
  canDismiss: () => boolean;
  dismiss: () => void;
  canGoBack: () => boolean;
  back: () => void;
  replace: (href: "/") => void;
};

/** Close a modal or go back; never leave the user on a dead-end screen. */
export function leaveToHome(router: LeaveRouter) {
  if (router.canDismiss()) {
    router.dismiss();
    return;
  }
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace("/");
}

/** Drop the current route entirely (unknown URLs, missing history). */
export function resetToHome(router: Pick<LeaveRouter, "replace">) {
  router.replace("/");
}
