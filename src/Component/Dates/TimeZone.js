import moment from 'moment-timezone'
moment.tz.setDefault("Asia/Singapore");

const FromateDate = (date) => {
    let _details = Date.parse(date);
    let temp2 =''
    if(!isNaN(_details) && (!(date instanceof Date))){
        temp2 = moment(date).format("MM/DD/YYYY");
    }
    else{
        temp2 = moment(date, 'DD-MM-YYYY').format("MM/DD/YYYY");
    }
    return (date) ? temp2 : moment(new Date()).format('YYYY-MM-DD');
}


const FromateDateMonth = (date) => {
    let _details = Date.parse(date);
    let temp2 =''
    if(!isNaN(_details) && (!(date instanceof Date))){
        temp2 = moment(date).format("DD/MM/YYYY");
    }
    else{
        var dateObj = new Date(date);
        temp2 = moment(date, 'DD-MM-YYYY').format("MM/DD/YYYY");
    }
    return temp2
}



const FromateDateUtc = (date) => {
    let _details = Date.parse(date);
    let temp2 =''
    if(!isNaN(_details)){
        temp2 = moment(date).format();
    }
    else{
        temp2 = moment(date, 'DD-MM-YYYY').format();
    }
    return (date) ? temp2 : moment(new Date()).format();
}




const FromateDate_YY_MM_DD = (date) => {
    let _details = Date.parse(date);
    let temp2 =''
    if(!isNaN(_details)){
        temp2 = moment(date).format("YYYY-MM-DD");
    }
    else{
        temp2 = moment(date, 'DD-MM-YYYY').format("YYYY-MM-DD");
    }
    console.log('FromateDate_YY_MM_DD', temp2)
    return temp2
}


const TodayDate = (date) => {
    return moment().format('DD-MM-YYYY');
}

const TodayDateSalash = (date) => {
    let _details = Date.parse(date);
    if(!isNaN(_details) && (!(date instanceof Date))){
        let _details = Date.parse(date);
        let temp2 =''
        if(!isNaN(_details)){
            temp2 = moment(date).format('DD/MM/YYYY');
        }
        else{
            var dateObj = new Date(date);
            var momentObj = moment(dateObj);
            temp2 = momentObj.format("DD/MM/YYYY");
        }
        return temp2;
    }
    else{
        return moment().format('DD/MM/YYYY');
    }
    
   
}

const TodayDateSalashDates = (date) => {
    return (date) ? moment(date, 'DD/MM/YYYY').format("YYYY-MM-DD") : moment().format('DD/MM/YYYY');
}

const DateMinusTime = (date) => {
    return (date) ? new Date(date) : moment().format("YYYY-MM-DD HH:mm:ss");
}


const DateTimeMinusTime = (date) => {
    return (date) ? moment(date).format("DD-MM-YYYY HH:mm:ss") : moment().format("DD-MM-YYYY HH:mm:ss");
}

const DateMinusTimeNoIni = (date) => {
    return (date) ? moment(date).format("DD/MM/YYYY HH:mm:ss") : '';
}



const ddmmyy = (date) => {
    return moment(date).format('DD/MM/YYYY');
}


const InitialDate = () => {
    return moment(new Date());
}

const DateMinus = (months, formate="year") => {
    if(formate=="date"){
        let currentDate = new Date();
        let startDateString = moment(currentDate.setMonth(currentDate.getMonth() - months)).format('DD/MM/YYYY');
        return startDateString
    }
    else{
          let currentDate = new Date();
        let startDateString = moment(currentDate.setMonth(currentDate.getMonth() - months)).format('YYYY-MM-DD');
        return startDateString
    }
   
}

const addDate = (date, adddate) => {
    return moment(date).add(adddate, 'days').format('DD/MM/YYYY')
}

const convertDateToYear = (date) =>{
    let _details = Date.parse(date);    
    let temp2 =''
    if(!isNaN(_details)){
        temp2 = moment(date, 'DD-MM-YYYY').format("YYYY-MM-DD");
    }
    else{
      
        temp2 = moment(date, 'DD-MM-YYYY').format("YYYY-MM-DD");
    }
    return temp2;
}

const convertYearToDate = (date) =>{
    var date = moment(date, 'YYYY-MM-DD')
    return date.format('DD/MM/YYYY')
}

const CalcDate = (get_date) =>{
    let temp1 = moment(new Date(), 'DD-MM-YYYY')
    let _details = Date.parse(get_date);
    let temp2 =''
    let diffDays = 0
    if(!isNaN(_details)){
        temp2 = moment(get_date, 'DD-MM-YYYY')
    }
    else{
        temp2 = moment(get_date, 'DD-MM-YYYY')
    }

    diffDays = temp2.diff(temp1, 'days');
    diffDays += 1
    return diffDays
}

const DateDiff = (senddate) =>{
    var dateofvisit = moment(new Date(senddate), 'DD-MM-YYYY');
    var today = moment();
    return today.diff(dateofvisit, 'days');
}



const DateMinusTimeLogin = (date) =>{
    return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

const DateMinusTimeLoginYear = (date) =>{
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
}

const number_only  = (e) =>{
    var reg = /^\d*\.?\d*$/;
    if (!reg.test(String.fromCharCode(e.which)) && e.target && e.target.value>=0) { 
        e.preventDefault();
    }
}

const decimal_number  = (e) =>{
    var reg = /^\d+\.\d{0,2}$/;
    if (e.target.value.match(reg)) { 
        e.preventDefault();
    }
}

const CompareDate = (startdate, enddate) => {
    startdate = moment(startdate);
    enddate = moment(enddate);
    if(enddate>=startdate){
        return true
    }
    return false
  
}


const CompareDateQut = (startdate, enddate) => {
  
    var startdate = moment(startdate).format("YYYY-MM-DD");
    var enddate = moment(enddate).format("YYYY-MM-DD");
    console.log('CompareDateQut', moment(startdate).isAfter(enddate, 'date'))
    if (moment(startdate).isAfter(enddate, 'date')) {
        return true 
    }
    else{
        return false
    }
   
  
}




export { FromateDate, TodayDate, ddmmyy, TodayDateSalash, addDate, InitialDate, DateMinus, DateMinusTime, CalcDate, convertDateToYear, convertYearToDate, TodayDateSalashDates, DateTimeMinusTime, DateMinusTimeLogin, number_only, FromateDate_YY_MM_DD, DateMinusTimeLoginYear, FromateDateUtc, FromateDateMonth, DateMinusTimeNoIni, decimal_number, CompareDate, DateDiff, CompareDateQut}