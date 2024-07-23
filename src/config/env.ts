const getValueOrDefault = (key: string, defaultValue: any) => {
  const value = process.env[key];

  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`Missing environment variable - "${key}"`);
    }

    return defaultValue;
  }

  return value.toString().trim();
};

const types = {
  int: (key: string, defaultValue?: number) => {
    const value = getValueOrDefault(key, defaultValue);
    const numberValue = parseInt(value, 10);

    if (!Number.isSafeInteger(numberValue)) {
      throw new Error(
        `Environment variable "${key}" should contain an integer value, got ${typeof numberValue} - ${value}`,
      );
    }

    return numberValue;
  },
  string: (key: string, defaultValue?: string) => {
    return getValueOrDefault(key, defaultValue);
  },
};

export const env = {
  ...types,
};
