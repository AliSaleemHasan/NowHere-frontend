export const handleArrayQueryParam = (
  param: string | string[],
  paramName: string
) => {
  if (!param || param.length === 0) return "";

  if (typeof param === "string")
    return `?${paramName}=${param.split(",").join(`&${paramName}=`)}`;

  return `?${paramName}=${param.join(`&${paramName}=`)}`;
};
