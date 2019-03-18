import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

function ChildStoreDecorator() {
  return (OriginComponent: any) => {
    class ChildStoreComponent extends PureComponent {
      props: any;

      static contextTypes = {
        dispatch: PropTypes.func,
        originStore: PropTypes.object,
      }

      render() {
        return (
          <OriginComponent store={{
            state: this.props.state,
            dispatch: this.context.dispatch.bind(this),
            originStore: this.context.originStore,
          }} {...this.props} />
        );
      }
    }

    return connect(state => {
      return { state };
    })(ChildStoreComponent);
  };
}

export default ChildStoreDecorator;
