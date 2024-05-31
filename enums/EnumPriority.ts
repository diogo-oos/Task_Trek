export enum Priority {
    Low,
    Medium,
    High,
}

export const getPriority = (priority: Priority) => {
    switch (priority) {
        case Priority.Low:
            return 'baixa';
        case Priority.Medium:
            return 'média';
        case Priority.High:
            return 'alta';
        default:
            return 'baixa';
    }
}