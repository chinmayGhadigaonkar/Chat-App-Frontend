const StoreItemInStoreage = (key: string, value: any, get: string) => {
  if (get == "get") {
    return localStorage.getItem(key);
  }
  localStorage.setItem(key, JSON.stringify(value));
};

export { StoreItemInStoreage };
