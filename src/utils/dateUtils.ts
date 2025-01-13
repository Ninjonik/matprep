// dateUtils.ts

// Function to get the current week number of the year
export const getCurrentWeek = (): number => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return Math.ceil((days + 1) / 7);
};

// Function to get the number of days until a specific date
export const getDaysUntil = (targetDate: Date): number => {
    const currentDate = new Date();
    const timeDifference = targetDate.getTime() - currentDate.getTime();

    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
};
