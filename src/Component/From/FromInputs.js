import React, {Fragment} from 'react';
import DatePicker from "react-datepicker";
import Moment from 'react-moment';
import "react-datepicker/dist/react-datepicker.css";


const CustomInputNoLabel = ({ value, onChange, onClick }) => {
    return <input
    value={(value) ? value : ''}
    onkeydown={(e)=>{return false }}
    keypress={(e)=>{return false }}
    readOnly={true}
    className='form-control date-pickers'
    onChange={e => onChange((e && e.target && e.target.value) ? e.target.value : '')}
    onClick={onClick}
    style={{ border: "solid 1px pink" }}
  />

};

const FromInputs = (props) => {
    return   <Fragment>
        <div className="col-md-12"><label>{props.label} {(props.rem) ? <span className="text-danger">*</span> :''}</label></div>
        <div className="col-md-12">
            <input  {...props.input}  className="form-control" placeholder={props.placeholder} name={props.input.name} id={props.input.name} readonly={(props.readonly) ? 'readonly' : false}/>
            <div className="text-danger">
                {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
            </div>
        </div>
    </Fragment>
};

const FromTextArea = (props) => {
    return   <Fragment>
        <div className="col-md-12"><label>{props.label} {(props.rem) ? <span className="text-danger">*</span> :''}</label></div>
        <div className="col-md-12">
        <textarea  {...props.input}  className="form-control" placeholder={props.placeholder} name={props.input.name} id={props.input.name} readonly={(props.readonly) ? 'readonly' : false}/>
            <div className="text-danger">
                {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
            </div>
        </div>
    </Fragment>
};


const FromInputsParallel = (props) => {
    return    <div className="col-12 col-md-6 parallel-label"><div className="row mt-2">
<div className="col-12 col-md-3 " style={{paddingRight:'0px'}}><label>{props.label} {(props.rem) ? <span className="text-danger">*</span> :''} :</label></div>
        <div className="col-12 col-md-9">
            <input  {...props.input}  className="form-control" placeholder={props.placeholder} name={props.input.name} id={props.input.name} readonly={(props.readonly) ? 'readonly' : false}/>
            <div className="text-danger">
                {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
            </div>
        </div>
        </div>
    </div>
};


const FromInputsParallelForAllCompany = (props) => {
    return    <div className="col-12 col-md-6 parallel-label"><div className="row mt-2">
<div className="col-12 col-md-3 " style={{paddingRight:'0px',paddingTop:'7px'}}><label>{props.label} {(props.rem) ? <span className="text-danger">*</span> :''} :</label></div>
        <div className="col-12 col-md-9">
            <input  {...props.input}  className="form-control" placeholder={props.placeholder} name={props.input.name} id={props.input.name} readonly={(props.readonly) ? 'readonly' : false}/>
            <div className="text-danger">
                {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
            </div>
        </div>
        </div>
    </div>
};


const FromInputsParallelForCompany = (props) => {
    return    <div className="col-12 col-md-10 parallel-label"><div className="row mt-2">
<div className="col-12 col-md-4 " style={{paddingRight:'0px;'}}><label>{props.label} {(props.rem) ? <span className="text-danger">*</span> :''} :</label></div>
        <div className="col-12 col-md-8">
            <input  {...props.input}  className="form-control" placeholder={props.placeholder} name={props.input.name} id={props.input.name} readonly={(props.readonly) ? 'readonly' : false}/>
            <div className="text-danger">
                {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
            </div>
        </div>
        </div>
    </div>
};


const FromInputsParallelSingle = (props) => {
    return    <div className="col-12 col-md-6 parallel-label"><div className="row mt-2">
        <div className="col-12"><label>{props.label} {(props.rem) ? <span className="text-danger">*</span> :''}</label></div>
        <div className="col-12">
            <input  {...props.input}  className="form-control" placeholder={props.placeholder} name={props.input.name} id={props.input.name} readonly={(props.readonly) ? 'readonly' : false}/>
            <div className="text-danger">
                {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
            </div>
        </div>
        </div>
    </div>
};

const FromSelectParallel = (props) => {
    return   <Fragment>
         <div className="col-12 col-md-6 parallel-label">
             <div className="row mt-2">
                <div className="col-12 col-md-3 mt-2"><label>{props.label} {(props.rem) ? <span className="text-danger">*</span> :''} :</label></div>
                <div className="col-12 col-md-9">
                    <select  {...props.input}  className="form-control"  name={props.input.name} id={props.input.name} readonly={(props.readonly) ? 'readonly' : false}>
                    {props.children}
                    </select>
                    <div className="text-danger">
                        {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
                    </div>
                </div>
            </div>
        </div>
    </Fragment>
};

const FromSelectParallelForCompany = (props) => {
    return   <Fragment>
         <div className="col-12 col-md-10 parallel-label">
             <div className="row mt-2">
                <div className="col-12 col-md-4"><label>{props.label} {(props.rem) ? <span className="text-danger">*</span> :''} :</label></div>
                <div className="col-12 col-md-8">
                    <select  {...props.input}  className="form-control"  name={props.input.name} id={props.input.name} readonly={(props.readonly) ? 'readonly' : false}>
                    {props.children}
                    </select>
                    <div className="text-danger">
                        {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
                    </div>
                </div>
            </div>
        </div>
    </Fragment>
};

const FromSelectParallelSingle = (props) => {
    return   <Fragment>
         <div className="col-12 col-md-6 parallel-label">
             <div className="row mt-2">
                <div className="col-12"><label>{props.label} {(props.rem) ? <span className="text-danger">*</span> :''}</label></div>
                <div className="col-12">
                    <select  {...props.input}  className="form-control"  name={props.input.name} id={props.input.name} >
                    {props.children}
                    </select>
                    <div className="text-danger">
                        {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
                    </div>
                </div>
            </div>
        </div>
    </Fragment>
};



const FromTextareaParallel = (props) => {
    return    <div className="col-12 col-md-6 parallel-label"><div className="row mt-2">
        <div className="col-12 col-md-3"><label>{props.label} {(props.rem) ? <span className="text-danger">*</span> :''}</label></div>
        <div className="col-12 col-md-9">
            <textarea  {...props.input}  className="form-control" placeholder={props.placeholder} name={props.input.name} id={props.input.name} readonly={(props.readonly) ? 'readonly' : false}/>
            <div className="text-danger">
                {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
            </div>
        </div>
        </div>
    </div>
};


const FromTextareaTable = (props) => {
    return    <Fragment><textarea  {...props.input}  className="form-control" placeholder={props.placeholder} name={props.input.name} id={props.input.name} readonly={(props.readonly) ? 'readonly' : false}/>
            <div className="text-danger">
                {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
            </div></Fragment>

};


const FormDatePicker = ({input,rem, defaultValue,dateformate, clear, readonly, minDate, maxDate,label, selected,meta: {touched, error, warning} }) => {
  return <Fragment>
          <div className="col-md-12 parallel-label"><label>  {label} {(rem) ? <span className="text-danger">*</span> :''}</label></div>
          <div className="col-md-12">
            <DatePicker  {...input} dateFormat={"dd/MM/yyyy"} selected={selected}  placeholder={label} className="form-control" dropdownMode="select" minDate={(minDate) ? minDate : ''} maxDate={(maxDate) ? maxDate : ''} readOnly={(readonly) ? true : false} customInput={<CustomInputNoLabel />} isClearable={(clear) ? true : false}/>
            <div className="text-danger">
                    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
                </div>
            </div>
    </Fragment>
}

const FormDatePickerReact = ({minDate, maxDate, readonly, clear, selected, label, handleChange}) => {
    console.log('handleChange', handleChange, selected)
    return <DatePicker dateFormat={"dd/MM/yyyy"} className="form-control" dropdownMode="select" minDate={(minDate) ? minDate : ''}  customInput={<CustomInputNoLabel />} selected={selected}  onChange={handleChange}/>
}

const FormDatePickerNoLabel = ({input, readonly, defaultValue,customInput,minDate,label, selected,meta: {touched, error, warning} }) => {
    return <Fragment>

            <DatePicker strictParsing {...input} dateFormat={"dd/MM/yyyy"} selected={selected} placeholder={label} className="form-control" dropdownMode="select" minDate={(minDate) ? minDate : ''} customInput={customInput ? customInput : ''} readOnly={(readonly) ? 'readonly' : false} disabledKeyboardNavigation={false} autoComplete={false} />
            <div className="text-danger">
                    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
                </div>
    </Fragment>
}

const FormDatePickerNoLabelTabel = ({input, readonly, defaultValue,customInput,minDate,label, selected,meta: {touched, error, warning} }) => {
    return <Fragment>

            <DatePicker strictParsing {...input} dateFormat={"dd/MM/yyyy"} selected={selected} placeholder={label} className="form-control" dropdownMode="select" minDate={(minDate) ? minDate : ''}  readOnly={(readonly) ? 'readonly' : false} disabledKeyboardNavigation={false} autoComplete={false}  customInput={<CustomInputNoLabel />}/>
            <div className="text-danger">
                    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
                </div>
    </Fragment>
}

const FormDatePickerParallel = ({input, readonly,clear, defaultValue,minDate,maxDate,label, selected,meta: {touched, error, warning} }) => {
 return <div className="col-12 col-md-6 parallel-label">
    <div className="row mt-2">
   <div className="col-md-3 "><label>{label}</label></div>
       <div className="col-md-9">
       <DatePicker  dateFormat={"dd/MM/yyyy"}  {...input} selected={selected} placeholder={label} className="form-control" dropdownMode="select" minDate={(minDate) ? minDate : ''} maxDate={(maxDate) ? maxDate : ''}  readOnly={(readonly) ? 'readonly' : false} customInput={<CustomInputNoLabel />} isClearable={(clear) ? true : false}/>
       <div className="text-danger">
               {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
           </div>
       </div>
   </div>
   </div>
}

const FormDatePickerParallelCustomClass = ({input, class_name, readonly,clear, defaultValue,minDate,maxDate,label, selected,meta: {touched, error, warning} }) => {
    return <div className={class_name}>
       <div className="row mt-2 parallel-label">
      <div className="col-md-4"><label>{label}</label></div>
          <div className="col-md-8">
          <div className="">
            <DatePicker  dateFormat={"dd/MM/yyyy"}  {...input} selected={selected} placeholder={label} className="form-control" dropdownMode="select" minDate={(minDate) ? minDate : ''} maxDate={(maxDate) ? maxDate : ''}  readOnly={(readonly) ? 'readonly' : false} customInput={<CustomInputNoLabel />} isClearable={(clear) ? true : false}/>
            <div className="text-danger">
                    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
                </div>
            </div>
          </div>
      </div>
      </div>
   }
const FormDatePickerParallelForIPP = ({input, readonly,clear, defaultValue,minDate,maxDate,label, selected,meta: {touched, error, warning},rem }) => {
    return <div className="col-12 col-md-6">
       <div className="row mt-2">
      <div className="col-md-3"><label>{label} {(rem) ? <span className="text-danger">*</span> :''} :</label></div>
          <div className="col-md-9">
          <DatePicker  dateFormat={"dd/MM/yyyy"}  {...input} selected={selected} placeholder={label} className="form-control" dropdownMode="select" minDate={(minDate) ? minDate : ''} maxDate={(maxDate) ? maxDate : ''}  readOnly={(readonly) ? 'readonly' : false} customInput={<CustomInputNoLabel />} isClearable={(clear) ? true : false}/>
          <div className="text-danger">
                  {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
              </div>
          </div>
      </div>
      </div>
   }

const FormDatePickerParallelForCompany = ({input, readonly,clear, defaultValue,minDate,maxDate,label, selected,meta: {touched, error, warning} }) => {
    return <div className="col-12 col-md-10">
       <div className="row mt-2">
      <div className="col-md-4"><label>{label} :</label></div>
          <div className="col-md-8">
          <DatePicker  dateFormat={"dd/MM/yyyy"}  {...input} selected={selected} placeholder={label} className="form-control" dropdownMode="select" minDate={(minDate) ? minDate : ''} maxDate={(maxDate) ? maxDate : ''}  readOnly={(readonly) ? 'readonly' : false} customInput={<CustomInputNoLabel />} isClearable={(clear) ? true : false}/>
          <div className="text-danger">
                  {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
              </div>
          </div>
      </div>
      </div>
   }


const FormDatePickerParallelSingle = ({input, defaultValue,minDate,label, selected,meta: {touched, error, warning} }) => {
    return <div className="col-12 col-md-6">
       <div className="row mt-2">
      <div className="col-md-12"><label>{label}</label></div>
          <div className="col-md-12">
          <DatePicker  dateFormat={"dd/MM/yyyy"}  {...input} selected={selected} placeholder={label} className="form-control" dropdownMode="select" minDate={(minDate) ? minDate : ''}  customInput={<CustomInputNoLabel />}/>
          <div className="text-danger">
                  {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
              </div>
          </div>
      </div>
      </div>
}

let RawFormDatePickerParallelSingle =(props) =>{
    return <div className="row mt-2">
       <div className="col-md-12">
            <DatePicker  dateFormat={"dd/MM/yyyy"} selected={(props.selected) ? props.selected : new Date()}  placeholder={props.label} className="form-control" dropdownMode="select" minDate={(props.minDate) ? props.minDate : ''} onChange={props.onChange} customInput={<CustomInputNoLabel />}/>
        </div>
   </div>
}



const FromSelect = (props) => {
    if(props.change_detuct){
                return   <Fragment>
                <div className="col-md-12"><label>{props.label} {(props.rem) ? <span className="text-danger">*</span> :''}</label></div>
                <div className="col-md-12">
                    <select  {...props.input}  value={(props.select_value) ? props.select_value : 1} className="form-control" onChange={(props.change_detuct) ? (e)=>props.change_detuct(e.target.value) : ()=>{}}   name={props.input.name} id={props.input.name} readOnly={(props.readonly) ? 'readonly' : false}    disabled={(props.disable_input) ? true : false}>
                    {props.children}
                    </select>
                    <div className="text-danger">
                        {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
                    </div>
                </div>
            </Fragment>
    }

    else{
        console.log('props.disabled', props)
        return   <Fragment>
        <div className="col-md-12"><label>{props.label} {(props.rem) ? <span className="text-danger">*</span> :''}</label></div>
        <div className="col-md-12">
            <select  {...props.input}  className="form-control" name={props.input.name} id={props.input.name} readOnly={(props.readonly) ? 'readonly' : false}  disabled={(props.disable_input) ? true : false}>
             {props.children}
            </select>
            <div className="text-danger">
                {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
            </div>
        </div>
        </Fragment>
    }


};

const FromSelectNoLabel = (props) => {
    return   <Fragment>
            <select  {...props.input}  value={props.inputvalue}  className="form-control"  name={props.input.name} id={props.input.name} disabled={(props.disabled) ? props.disabled  : false } >
             {props.children}
            </select>
            <div className="text-danger">
                {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
            </div>
    </Fragment>
};

const FromCheckBox = (props) => {
    if(props.onClick){
        console.log('FromCheckBox', props.onClick)
        return   <Fragment>  <div className="col-3">
                        <input type="checkbox" data-value={props.inputvalue} value={props.inputvalue} className="form-check-input form-checkobx" {...props.input} checked={props.checked} onClick={(props.onClick) ? (e)=>{props.onClick(e)} : ()=>{}}/><label htmlFor={props.input.name}>{props.label}</label>
                </div>
                <div className="text-danger">
                    {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
                </div>
        </Fragment>
    }
    else{
       return  <Fragment>  <div className="col-3">
                        <input type="checkbox" data-value={props.inputvalue} value={props.inputvalue} className="form-check-input form-checkobx" {...props.input} checked={props.checked} /><label htmlFor={props.input.name}>{props.label}</label>
                </div>
                <div className="text-danger">
                    {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
                </div>
        </Fragment>
    }
};


const FromInputsPlain = (props) => {
    console.log('FromInputsPlain', props.date)
    return   <Fragment>
        <div className="col-md-12">
            <DatePicker selected={(props.date) ? props.date : ''} onChange={props.onChange}  className={props.className}/>
        </div>
    </Fragment>
};

const FromInputsPlainDate = (props) => {
    console.log('FromInputsPlainDate', props.date)
    return   <Fragment>
        <div className="col-md-12">
            <DatePicker selected={new Date()} onChange={props.onChange}  className={props.className}/>
        </div>
    </Fragment>
}


const FromCheckBoxFullWidth = (props) => {
    if(props.onClick){
        return   <Fragment>
                <div>
                    <input disabled={(props.disabled_input) ? props.disabled_input : false} type="checkbox" data-value={props.inputvalue} value={props.inputvalue} className="form-check-input form-checkobx" {...props.input} checked={props.checked} onClick={(props.onClick) ? (e)=>{props.onClick(e)} : ()=>{}}/><label htmlFor={props.input.name}>{props.label}</label>
                </div>
                <div className="text-danger">
                    {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
                </div>
        </Fragment>
    }
    else{
       return  <Fragment>  <div >
                        <input type="checkbox" data-value={props.inputvalue} value={props.inputvalue} className="form-check-input form-checkobx" {...props.input} checked={props.checked} /><label htmlFor={props.input.name}>{props.label}</label>
                </div>
                <div className="text-danger">
                    {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
                </div>
        </Fragment>
    }
};
const FromCheckBoxparallel = (props) => {
    if(props.hasOwnProperty('checked')){
        return   <Fragment>  <div className="col-12">
                    <input type="checkbox" data-value={props.inputvalue} checked={props.checked} value={props.inputvalue} className="form-check-input form-checkobx" {...props.input} onClick={(props.onClick) ? (e)=>{props.onClick(e)} : ()=>{}}/><label htmlFor={props.input.name}>{props.label}</label>
            </div>
             <div className="text-danger">
                {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
            </div>
    </Fragment>
    }
    else{
        return   <Fragment>  <div className="col-12">
                    <input type="checkbox" data-value={props.inputvalue} value={props.inputvalue} className="form-check-input form-checkobx" {...props.input} onClick={(props.onClick) ? (e)=>{props.onClick(e)} : ()=>{}}/><label htmlFor={props.input.name}>{props.label}</label>
            </div>
             <div className="text-danger">
                {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
            </div>
    </Fragment>
    }

};



const FromCheckBoxFull = (props) => {
    console.log('(props)', (props.checked) ? true : false )
    return   <Fragment>  <div className="col-12"><input type="checkbox" checked={(props.checked) ? true : false } data-value={props.inputvalue} value={props.inputvalue} className="form-check-input form-checkobx" {...props.input} onClick={(props.onClick) ? (e)=>{props.onClick(e)} : ()=>{}}/><label htmlFor={props.input.name}>{props.label}</label></div>
             <div className="text-danger">
                {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
            </div>
    </Fragment>
};


const FormPlainInput = (props) =>{
    return <div className="row mt-2">
        <div className={props.label_split}><label>{props.name} {(props.rem) ? <span className="text-danger">*</span> :''} :  </label></div>
        <div className={props.input_split}><input type="text" className="form-control" name={props.input_name} id={props.id} placeholder={props.input_name} /></div>
    </div>
}

const TablePlainInput = (props) =>{
    return <div>
        <div className={props.input_split}><input type="text" className="table-select" name={props.input.name} {...props.input} placeholder={props.name} className="form-control" /></div>
    </div>
}


const TableSelect = (props) => {
    return   <Fragment> <select  {...props.input}  name={props.input.name} id={props.input.name} >
             {props.children}
            </select>
            <div className="text-danger">
                {props.meta.touched && ((props.meta.error && <span>{props.meta.error}</span>) || (props.meta.warning && <span>{props.meta.warning}</span>))}
            </div>
    </Fragment>
};




const FromUplods = (props) =>{
    return <Fragment>
        <div className="col-12">
        <div className="form-group">
   <label for="pwd">  {props.label}:</label>
   <div className="row">
      <div className="col-md-6"><input type="file" className="custom-file-input " id={props.id} onChange={props.SendUpload} name={props.name} aria-describedby="inputGroupFileAddon01" />

       {props.decs ? props.decs : ''}
      </div>
      {(props.upload_button!=false) ? <div className="col-md-6"><button type="button" type="button" className="btn btn-outline-primary btn-sm " value="Upload" data-name={props.name} onClick={props.FileUpload} id="">Upload</button></div> : ''}
   </div>
</div>
</div>
{/* <div className="col-12"><label>{props.label}</label></div>
    <div className="col-9">
        <div className="input-group">
            <div className="custom-file">
                <input type="file" className="custom-file-input" id={props.id} onChange={props.SendUpload} name={props.name} aria-describedby="inputGroupFileAddon01" />
                <label className="custom-file-label" htmlFor="inputGroupFile01" >Choose file</label>
            </div>
        </div>
            {(!props.fileuploaded && props.filename) ?   <Fragment><strong> File Choosed : </strong> <span>{props.filename}</span></Fragment> : (props.fileuploaded) ? 'details': ''}
    </div>
    <div className="col-3">
        <div className="input-group">
            <span className="btn btn-outline-primary btn-sm" data-name={props.name} onClick={props.FileUpload} id="">{props.buttontext}</span>
        </div>
    </div> */}
    </Fragment>
}


const FromUplodsParallel = (props) =>{
    return <Fragment>

    <div className="col-3"><label>{props.label} {(props.rem) ? <span className="text-danger">*</span> :''}</label></div>
    <div className="col-7">
        <div className="input-group">
            <div className="custom-file">
                <input type="file" className="custom-file-input" id={props.id} onChange={props.SendUpload} name={props.name} aria-describedby="inputGroupFileAddon01" />
            </div>
        </div>
            {/* {(!props.fileuploaded && props.filename) ?   <Fragment><strong> File Choosed : </strong> <span>{props.filename}</span></Fragment> : (props.fileuploaded) ? 'details': ''} */}
    </div>
    <div className="col-2">
        <div className="input-group">
            <span className="btn btn-outline-primary btn-sm" data-name={props.name} onClick={props.FileUpload} id="">{props.buttontext}</span>
        </div>
    </div>
    {props.decs ? <Fragment><div className="col-3"></div> <div className="col-9">{props.decs}</div>  </Fragment>: ''}
    </Fragment>
}

const CheckBoxInline = (props) =>{

    return <div className="form-check-inline">
                <label className="form-check-label">
                    <input className="contractcatlog.itemTypeList"   type="checkbox" className="form-check-input" {...props.input}  id={props.id} value={props.inputvalue}/>{props.labelname}
                </label>
            </div>
}


const FormRadioButton = ({input,label,onClick, checkvalue, checked,value, meta: {touched, error, warning} }) => {
    if(onClick){
       console.log('FormRadioButton', onClick)
        return <Fragment>
        <label className="form-check-label">
            <input {...input}  type="radio" checked={checked} className=""  value={checkvalue} onClick={onClick} /> {label}
        </label>
    </Fragment>
    }
    else{
        return <Fragment>
        <label className="form-check-label">
            <input {...input}  type="radio" checked={checked} className=""  value={checkvalue}  /> {label}
        </label>
    </Fragment>
    }

}


const FormRadioButtonSpan = ({input,label,selected, checkvalue,onChange, checked,meta: {touched, error, warning} }) => {
    return <span className="span-checkbox">
         <input {...input}  type="checkbox" checked={checked} data-checkvalue={checkvalue} className={checkvalue} onClick={(input.onChange) ? ()=>input.onChange : ()=>{}} className=""  id={label} value={checkvalue}/>
         <label className="form-check-label" htmlFor={label}>{label}</label>
    </span>
}

const DateCustomInput = ({value, onClick}) =>{
   return  <span className="calendar-icon" onClick={onClick}><i className="fa fa-calendar"></i></span>
}


const FormDatePickerParallelNoLabel = ({
  input,
  readonly,
  clear,
  defaultValue,
  minDate,
  maxDate,
  label,
  selected,
  meta: { touched, error, warning },
}) => {
  return (
    <div className="col-12 col-md-6">
      <DatePicker
        dateFormat={"dd/MM/yyyy"}
        {...input}
        selected={selected}
        placeholder={label}
        className="form-control"
        dropdownMode="select"
        minDate={minDate ? minDate : ""}
        maxDate={maxDate ? maxDate : ""}
        readOnly={readonly ? "readonly" : false}
        customInput={<CustomInputNoLabel />}
        isClearable={clear ? true : false}
      />
      <div className="text-danger">
        {touched &&
          ((error && <span>{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  );
};

const FormDatePickerParallelForAudit = ({
  input,
  readonly,
  clear,
  defaultValue,
  minDate,
  maxDate,
  label,
  selected,
  meta: { touched, error, warning },
}) => {
  return (
    <div className="">
      <div className="row mt-2">
        <div className="col-md-3">
          <label>{label}</label>
        </div>
        <div className="col-md-6">
          <DatePicker
            dateFormat={"dd/MM/yyyy"}
            {...input}
            selected={selected}
            placeholder={label}
            className="form-control"
            dropdownMode="select"
            minDate={minDate ? minDate : ""}
            maxDate={maxDate ? maxDate : ""}
            readOnly={readonly ? "readonly" : false}
            customInput={<CustomInputNoLabel />}
            isClearable={clear ? true : false}
          />
          <div className="text-danger">
            {touched &&
              ((error && <span>{error}</span>) ||
                (warning && <span>{warning}</span>))}
          </div>
        </div>
      </div>
    </div>
  );
};




export {
  FromInputs,
  FromSelect,
  FromCheckBox,
  FromUplods,
  FromCheckBoxFull,
  FormPlainInput,
  TablePlainInput,
  TableSelect,
  CheckBoxInline,
  FormDatePicker,
  FormRadioButton,
  FormRadioButtonSpan,
  FromInputsParallel,
  FormDatePickerParallel,
  FromCheckBoxparallel,
  FromTextareaParallel,
  FromUplodsParallel,
  FromSelectNoLabel,
  FromTextareaTable,
  FormDatePickerNoLabel,
  FormDatePickerParallelForAudit,
  DateCustomInput,
  FromSelectParallel,
  FromInputsParallelSingle,
  FormDatePickerParallelSingle,
  FromSelectParallelSingle,
  RawFormDatePickerParallelSingle,
  FromCheckBoxFullWidth,
  FormDatePickerNoLabelTabel,
  FormDatePickerReact,
  FormDatePickerParallelNoLabel,
  FromSelectParallelForCompany,
  FormDatePickerParallelCustomClass,
  FromTextArea,
  FormDatePickerParallelForCompany,
  FormDatePickerParallelForIPP,
  FromInputsParallelForCompany,
  FromInputsPlain,
  FromInputsPlainDate,
  FromInputsParallelForAllCompany
};
