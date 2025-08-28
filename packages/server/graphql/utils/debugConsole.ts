import util from "util";

export const debugConsole = (obj: unknown) => {
  console.log(
    util.inspect(obj, {
      showHidden: false,
      depth: null,
      colors: true,
      showProxy: false,
    }),
  );
};

console.log('teste')
