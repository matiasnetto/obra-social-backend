const cleanQueryParams = (queryParams: object, validQueryParams: string[]) => {
  const validQueryEntries = Object.entries(queryParams).filter(([key, value]) => {
    if (validQueryParams.some((el) => el === key)) {
      return [key, value];
    }
  });

  return Object.fromEntries(validQueryEntries);
};

export default cleanQueryParams;
