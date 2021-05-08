class Util 
{
    public static formatDate(date: Date)
    {
        const month = date.toLocaleString('default', { month: 'short' })
        const day = date.getDate();
        var formatted_date = month + " " + day
        return formatted_date;
    }
}

export { Util }