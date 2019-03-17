import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Provider, connect } from 'react-redux';

import { createStore } from 'redux';

import Module from '../module';

import { assert } from '../utils';

function RootStoreDecorator({ store }: CommonObject) {
  return (OriginComponent: any) => {
    const StoreModules = new Module(store);

    const reactReduxStore = createStore((...args) => {
      // 处理所有真实 reducer 动作
      const action: ActionInterface = args[1];

      const path = StoreModules.getPath(action.type);

      const rawModule: RawModuleInterface = StoreModules.getRawModule(path);
      const rawModuleState = StoreModules.getState(path);

      if (!rawModule || !action.reducerFuncName) return StoreModules.state;

      if (!rawModule.reducers || !rawModule.reducers[action.reducerFuncName]) {
        assert(`reducer: ${action.reducerFuncName} 不存在，请检查`);
        return StoreModules.state;
      }

      const nextState = rawModule.reducers[action.reducerFuncName](rawModuleState, action.playload);

      // 以下一个状态更新当前 state 树
      StoreModules.updateState(path, nextState);

      return {
        ...StoreModules.state,
      };
    }, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

    class RootStoreComponent extends PureComponent {
      props: any;

      static childContextTypes = {
        dispatch: PropTypes.func,
        originStore: PropTypes.object,
      }

      getChildContext() {
        return {
          dispatch: this.dispatch.bind(this),
          originStore: reactReduxStore,
        };
      }

      dispatch(action: string, playload: any) {
        // 等待 action 执行完成再 向 redux dispatch 真实 action，实现异步 action
        const _this = this;

        const splitArray = action.split('/');

        const actionFuncName = splitArray[splitArray.length - 1];

        const rawModule: RawModuleInterface = StoreModules.getRawModule(StoreModules.getPath(action));

        function dispatchHelper(reducerFuncName: string, playload: object) {
          _this.props.dispatch({ type: action, playload, reducerFuncName });
        }

        if (!rawModule.actions || !rawModule.actions[actionFuncName]) return assert(`action: ${action} 不存在，请检查`);

        rawModule.actions[actionFuncName]({ dispatch: dispatchHelper }, playload);
      }

      render() {
        return (
          <OriginComponent store={{
            state: this.props.state,
            dispatch: this.dispatch.bind(this),
            originStore: reactReduxStore,
          }} />
        );
      }
    }

    const ConnectComponent = connect(state => {
      return { state };
    })(RootStoreComponent);

    class ProviderComponent extends PureComponent {
      render() {
        return (
          <Provider store={reactReduxStore}>
            <ConnectComponent />
          </Provider>
        );
      }
    }

    return ProviderComponent;
  };
}

export default RootStoreDecorator;
