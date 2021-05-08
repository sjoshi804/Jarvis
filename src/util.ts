class Util 
{
    public static formatDate(date: Date)
    {
        const month = date.toLocaleString('default', { month: 'short' })
        const day = date.getDate();
        var formatted_date = month + " " + day
        return formatted_date;
    }

    public static getTodayDate()
    {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    }
    
    public static getTomorrowDate()
    {
        return new Date(Util.getTodayDate().getTime() + 24 * 60 * 60 * 1000);
    }
}

export { Util }