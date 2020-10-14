import React,{Component} from 'react';
import Select from 'react-select';

class SelectField extends Component {
  constructor(props){
    super(props);
  }


  state = {
    selectedOption: null,
  };
  handleChange = selectedOption => {
    debugger;
    this.props.history.push('./company_details');
    this.setState({ selectedOption });
  };
  render() {
    return (
      <Select
        isClearable={true}
        isSearchable={true}
        placeholder={this.props.isPlaceholder ? '--Select--' : ''}
        onChange={this.props.handleChange}
        options={(this.props.options) ? this.props.options : []}
      />
    );
  }
}

export default SelectField
