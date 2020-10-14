import React,{Fragment} from 'react';

const itemTableRow = (props) => {
    return (
        <Fragment >
            <tr>
                <td><input type='checkbox'></input></td>
                <td>{props.itemCode}</td>
                <td>{props.itemName}</td>
                <td>{props.commodityType}</td>
                <td>{props.uom}</td>
                <td>{props.status}</td>
            </tr>
        </Fragment>
    );
}

export default itemTableRow;