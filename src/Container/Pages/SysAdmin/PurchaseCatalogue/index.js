import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import Master from './Master';
import ItemAssignment from './ItemAssignment';
import Listing from './Listing';

class PurchaseCatalogue extends Component {
  constructor() {
    super();
    this.state = {
      active_key: 'Master',
      role_id: '',
      render: true,
    };
  }

  componentDidMount = () => {
    let _details = localStorage.getItem('list_details');

    console.log('_details', _details);
  };

  ChangeActiveKey = (details, role_id) => {
    this.setState({
      active_key: details,
      role_id: role_id,
      render: true,
    });
  };

  BlockRender = () => {
    this.setState({
      render: false,
    });
  };

  get_rold_id = () => {
    return {
      role_id: this.state.role_id,
      render: this.state.render,
    };
  };

  render() {
    console.log('****************************active_key***************', this.state.active_key);
    return (
      <div id="tabs">
        <Tabs
          defaultActiveKey="Master"
          transition={false}
          id="tabs"
          activeKey={this.state.active_key}
          onSelect={(k) => {
            this.setState({ active_key: k });
          }}
        >
          <Tab eventKey="Master" title="Purchaser Catalogue">
            <div className="tab-content py-3 px-3 px-sm-0">
            {
              this.state.active_key === 'Master' ?
              <Master {...this.props} /> : null
            }
            </div>
          </Tab>
          <Tab eventKey="Matrix" title="Items Assignment">
            <div className="tab-content py-3 px-3 px-sm-0">
            {
              this.state.active_key === 'Matrix' ?
              <ItemAssignment
                {...this.props}
                {...this.state}
                get_role={this.get_rold_id}
                block_render={this.BlockRender}
              /> : null
            }
            </div>
          </Tab>
          <Tab eventKey="Listing" title="Purchaser Assignment">
            <div className="tab-content py-3 px-3 px-sm-0">
            {
              this.state.active_key === 'Listing' ?
              <Listing {...this.props} change_tab={this.ChangeActiveKey} /> : null
            }
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default PurchaseCatalogue;
