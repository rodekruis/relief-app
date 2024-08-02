export class DateService {
    static todaysDateString(): string {
      var today = new Date();
  
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
  
      let dateString = year + "-"
  
      if(month < 10)
          dateString += "0"
  
      dateString += month
      dateString += "-"
  
      if(day < 10)
          dateString += "0"
  
      dateString += day
  
      return dateString
    }
  }