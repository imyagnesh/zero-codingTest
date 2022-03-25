const wrapper =
  (fn: Function) =>
  (...args: any) =>
    fn(...args).catch(args[2]);

export default wrapper;
