export enum Status {
    Todo,
    InProgress,
    Done,
}

export const getStatus = (priority: Status) => {
    switch (priority) {
        case Status.Todo:
            return 'A fazer';
        case Status.InProgress:
            return 'Em andamento';
        case Status.Done:
            return 'Feito';
        default:
            return 'A fazer';
    }
}