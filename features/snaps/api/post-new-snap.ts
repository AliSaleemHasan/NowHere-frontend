export const PostSnapBody = (
  snaps: Array<string>,
  param_name: string = "snaps"
) => {
  const payload = new FormData();

  snaps.forEach((snap) => {
    payload.append(param_name, {
      uri: snap,
      name: snap.split("/").pop() || crypto.randomUUID(),
      type: `image/${snap.split(".").pop()}`,
    } as any);
  });

  return payload;
};
