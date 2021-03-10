  export default function getDatePosted(date) {
    const [ postYear, postMonth, postDate, postTime ] = post.postBody.created_at.split('-');
    const [ todaysDay, todaysMonth, todaysDate, todaysYear, todaysTime ] = Date(Date.now()).split(" ");
    let fullMonth;

    switch(postMonth) {
      case "01":
        fullMonth = "January";
        break;
      case "02":
        fullMonth = "February";
        break;
      case "03":
        fullMonth = "March";
        break;
      case "04":
        fullMonth = "April";
        break;
      case "05":
        break;
      case "06":
        fullMonth = "June";
        break;
      case "07":
        fullMonth = "July";
        break;
      case "08":
        fullMonth = "August";
        break;
      case "09":
        fullMonth = "September";
        break;
      case "10":
        fullMonth = "October";
        break;
      case "11":
        fullMonth = "November";
        break;
      case "12":
        fullMonth = "December";
        break;
      default:
        fullMonth = "Error";
    }

    if (todaysYear === postYear)
      return `${fullMonth} ${postDate[0] + postDate[1]}`
    else
      return `${fullMonth} ${postDate[0] + postDate[1]}, ${postYear}`
  }