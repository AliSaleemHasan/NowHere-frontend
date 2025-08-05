export const PostSnapBody = (snaps: Array<string>) => {
  const payload = new FormData();

  snaps.forEach((snap) => {
    payload.append("files", {
      uri: snap,
      name: snap.split("/").pop() || crypto.randomUUID(),
      type: `image/${snap.split(".").pop()}`,
    } as any);
  });

  return payload;
};
