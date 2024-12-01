export const getErrorString = (error: any): string => {
  if (typeof error === "string") {
    return error;
  } else if (Object.keys(error).length > 0) {
    return Object.values(error)[0] as string;
  } else {
    return "Something went wrong, please try again later";
  }
};
