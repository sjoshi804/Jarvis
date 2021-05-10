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
        var start_of_day = new Date()
        start_of_day.setHours(0, 0, 0, 0);
        const task_abbrev = task.title + " (" + task.points + ") - " + Util.formatDate(task.due_date)
        if (task.due_date != null && task.due_date < start_of_day)
        {
            return chalk.red(task_abbrev)
        }
        else 
        {
            return task_abbrev
        }
    }

    public static text_format_date(date: Date)
    {
        return date.toLocaleString('default', { month: 'long' }) + " " + date.getDate() + " " + date.getFullYear()
    }

    public static set_to_monday(date: Date) 
    {
        var day = date.getDay() || 7;  
        if( day !== 1 ) 
            date.setHours(-24 * (day - 1)); 
        return date;
    }

    public static set_to_next_week(date: Date)
    {
        date.setHours(24 * 7);
        return date
    }

    public static compare_tasks(a: any, b: any)
    {
        if (a.completed == b.completed)
        {
            return Util.get_valid_due_date(a.due_date) - Util.get_valid_due_date(b.due_date)
        }
        else if (a.completed == null)
        {
            return -1;
        }
        else
        {
            return 1;
        }
    }

    public static get_valid_due_date(due_date: any)
    {
        if (due_date == null)
        {
            return new Date(8640000000000000)
        }
        else 
        {
            return due_date
        }
    }

    public static is_date_in_current_week(date: Date)
    {
        const today = Util.get_today_date();
      
        // get first date of week
        const firstDayOfWeek = Util.set_to_monday(today)
      
        // get last date of week
        const firstDayOfNextWeek = Util.set_to_next_week(firstDayOfWeek)
      
        // if date is equal or within the first and last dates of the week
        // if date is equal or within the first and last dates of the week
        return date >= firstDayOfWeek && date < firstDayOfNextWeek;
    }

    public static filter_complete_tasks(task_list: any[])
    {
        var filtered_task_list = [];
        for (var i = 0; i < task_list.length; i++)
        {
            if (task_list[i].completed == null)
            {
                filtered_task_list.push(task_list[i])
            }
        }
        return filtered_task_list;
    }
}

export { Util }