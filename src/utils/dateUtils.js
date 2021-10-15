export function formateDate(time){
    if(!time) return ''
    let date=new Date(time)
    let h=date.getHours()
    let m=date.getMinutes()
    let s=date.getSeconds()
    return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+
    date.getDate()+' '+(h<10?'0'+h:h)+':'+(m<10?'0'+m:m)+':'+(s<10?'0'+s:s)
}