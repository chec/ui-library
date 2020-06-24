const makeVariants = (candidateOptions) => {
  const options = Object.entries(candidateOptions);
  const [key, values] = options.shift();

  if (!options.length) {
    return values.map((value) => ({ [key]: value }));
  }

  return values.reduce(
    (acc, value) => [
      ...acc,
      ...makeVariants(Object.fromEntries(options)).map((variant) => ({
        ...variant,
        [key]: value,
      })),
    ],
    [],
  );
};

export default makeVariants;
