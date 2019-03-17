import { objForEach, chainDefine } from './utils';

export default class Module {
  public state: object;
  private _rawModule: RawModuleInterface;

  constructor(rawModule: RawModuleInterface) {
    this.state = Object.create(null);

    this._rawModule = rawModule;

    this.collectionState([], rawModule);
  }

  // 根据路径获取具体 state
  getState(path: Array<string>) {
    return path.reduce((state: any, key: string) => {
      return state[key];
    }, this.state);
  }

  // 根据路径获取具体 rawModule
  getRawModule(path: Array<string>) {
    return path.reduce((module: any, key) => {
      return module.modules[key];
    }, this._rawModule);
  }

  // 更新整棵树
  updateState(path: Array<string>, nextState: object) {
    if (path.length === 0) return this.state = nextState;

    return chainDefine(this.state, path, nextState);
  }

  getPath(pathString: string) {
    return pathString.split('/').slice(0, -1);
  }

  // 递归整颗树，获取 state 集合
  collectionState(path: Array<string>, rawModule: RawModuleInterface) {
    if (path.length === 0) {
      this.state = rawModule.state;
    } else {
      const parent = this.getState(path.slice(0, -1));
      parent[path[path.length - 1]] = rawModule.state;
    }

    if (rawModule.modules) {
      objForEach(rawModule.modules, (rawChildModule: RawModuleInterface, key: string) => {
        this.collectionState(path.concat(key), rawChildModule);
      })
    }
  }
}
