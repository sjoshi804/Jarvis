class Util 
{
    public static formatDate(date: Date)
    {
        const month = date.toLocaleString('default', { month: 'short' })
        const day = date.getDate();
        var formatted_date = month + " " + day
        return formatted_date;
    }

    public static get_today_date()
    {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    }

    public static get_tomorrow_date()
    {
        return new Date(Util.get_today_date().getTime() + 24 * 60 * 60 * 1000);
    }

    public static get_date_bounds(date: Date)
    {
        const lower_bound = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
        const upper_bound = new Date(lower_bound.getTime() + 24 * 60 * 60 * 1000);
        return [lower_bound, upper_bound]
    }
}

export { Util }