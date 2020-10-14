import  React, {Component} from 'react';
import { Row,Col,Button  } from 'reactstrap';
class ImageUpload extends Component{
    constructor(props){
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            filename: null,
            uploadedfiles:null,
        };
    }
    onChange(e){
        if(e.target.files.length){
            this.setState({
                filename:(e.target.files && e.target.files.length) ? e.target.files[0].name : '',
                uploadedfiles: e.target.files[0]
            })
        }
    }

    UploadFile(e){
        e.preventDefault();
        this.props.UploadFile(this.props.token, this.state.uploadedfiles);
    }

    render(){
        return  <div className="container-fluid">
            <Col xs={12} sm={12} md={12}>
                <form onSubmit={this.UploadFile.bind(this)}>
                    <Row>
                        <Col xs={12} sm={12} md={12}>
                            <div className="form-group"> 
                                <div className="">
                                    <div className="upload_file text-center image_excel"> 
                                        <input className="form-control excelimport" id="uploadfile" name="sample_file" type="file" onChange={this.onChange} style={{height: '300px'}}/> 
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} sm={12} md={12}>
                            <div className="text-center product_button">
                                <Button className="btn btn-outline-primary upload_btn" type="submit" value="Upload">Upload</Button>
                            </div>
                        </Col>
                    </Row>
                </form>
            </Col>
        </div>
    }
}
export default ImageUpload;