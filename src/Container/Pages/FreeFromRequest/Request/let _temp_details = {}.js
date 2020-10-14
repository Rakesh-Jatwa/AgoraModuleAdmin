let _temp_details = {}
                _temp_details.RFQPOSubmit = _final_datas;
                this.setState({
                    loading:true
                })

                let _status =  await ApiExtract(FFPOSubmit, _temp_details)
                if(_status.status){
                    if(_status.status && _submit_details=="submit"){
                        if(!_status.response.isBudgetExceed){
                            let _loc_temp = localStorage.getItem('free_from')
                            if(_loc_temp){
                                _loc_temp = JSON.parse(_loc_temp)
                            }
                            else{
                                localStorage.setItem('free_from', JSON.stringify({viewState:'mod', strType:_details.prType, prid:_status.message,POM_PO_NO:_status.message,  POM_PO_INDEX : _status.response.insertId}))
                            }
                            this.setState({ submit_type : 'submit'})
                            this.props.history.push({
                                pathname:'/po_approval_setup_ffpo',
                                datas: {
                                    'approval_list': _status.response.ApprovalSetup,
                                    'pr_no':  _status.message,
                                    'pr_cost': this.state.table_body.reduce((a, val) => a += ((val.QUANTITY) ? val.QUANTITY : 0) * ((val.UNITCOST) ? val.UNITCOST : 0) + ((val.GST) ? val.GST : 0), 0) + parseFloat(this.state.shipping_charge),
                                }
                            })
                        }
                        else{
                            let _loc_temp = localStorage.getItem('free_from')
                            if(_loc_temp){
                                _loc_temp = JSON.parse(_loc_temp)
                            }
                            else{
                                localStorage.setItem('free_from', JSON.stringify({viewState:'mod', strType:_details.prType, prid:_status.message,POM_PO_NO:_status.message,  POM_PO_INDEX : _status.response.insertId}))
                            }

                            this.setState({
                                budget_details : {
                                    AM_ACCT_CODE: _status.response.AM_ACCT_CODE,
                                    AM_ACCT_DESC:  _status.response.AM_ACCT_DESC,
                                    AM_ACCT_INDEX:  _status.response.AM_ACCT_INDEX,
                                    AM_DEPT_INDEX:  _status.response.AM_DEPT_INDEX,
                                },
                                status: false,
                                validation:true,
                                modal_body: (_status.response) ? _status.response.exceedMsg : '',
                                loading:false,
                                submit_type : 'exceeds'
                            })
                        }
                       
                    }
                    else if(_status.status && _submit_details=="save"){
                        let _loc_temp = localStorage.getItem('free_from')
                        if(_loc_temp){
                            _loc_temp = JSON.parse(_loc_temp)
                        }
                        else{
                            localStorage.setItem('free_from', JSON.stringify({viewState:'mod', strType:_details.prType, prid:_status.message,POM_PO_NO:_status.message,  POM_PO_INDEX : _status.response.insertId}))
                        }
                       
                        this.props.change('raisePOForm.prNo', _status.message)
                        this.setState({
                            status: _status.status,
                            validation:true,
                            submit_type : 'save',
                            modal_body: ` Purchase Order Number ${_status.message} has been created`,
                            loading:false,
                            lblPONo : _status.message
                        })
                        // window.location.reload()
                    }
                    
                }