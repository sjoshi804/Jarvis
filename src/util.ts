// External Modules
const chalk = require('chalk');

class Util 
{
    public static formatDate(date: Date | null)
    {
        // Null check
        if (date == null)
        {
            return "No Due Date";
        }

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
        const upper_bound = new Date(lower_bound.getTime() + (24 * 60 * 60 * 1000) - 1);
        return [lower_bound, upper_bound]
    }

    public static print_error(message: string)
    {
        console.log(chalk.red(message));
    }

    public static format_separator(heading: string): string
    {
        return "==== " + heading + " ===="
    }

    public static short_display_task(task: { title: string; due_date: Date | null; points: number})
    {
        const task_abbrev = task.title + " (" + task.points + ") - " + Util.formatDate(task.due_date)
        if (task.due_date != null && task.due_date < (new Date()))
        {
            return chalk.red(task_abbrev)
        }
        else 
        {
            return task_abbrev
        }
    }
}

export { Util }