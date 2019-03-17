interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: Function;
}

interface CommonObject {
  [key: string]: any;
}

interface RawModuleInterface {
  state: object;
  actions: CommonObject;
  reducers: CommonObject;
  modules?: RawModuleInterface
}

interface ActionInterface {
  type: string;
  reducerFuncName?: string;
  playload?: object;
}
