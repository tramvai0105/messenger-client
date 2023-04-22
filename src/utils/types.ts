export type ChatElement = {
    person: Person,
    messages: Message[],
}

export type Person = {
    username: string,
}

export type Message = {
    time: number,
    text: string,
    from:string,
    to:string,
}

export type MessageFromSocket = {
    time: number,
    text: string,
    username:string,
    to:string,
}