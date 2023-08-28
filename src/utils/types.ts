export type ChatElement = {
    _id: number,
    person: Person,
    messages: Message[],
    inputData?: string,
}

export type Person = {
    username: string,
    avatar: string,
}

export type Message = {
    _id: string,
    time: number,
    body: string,
    from:string,
    to:string,
    type: string,
    mark?: string,
}

export type MessageFromSocket = {
    _id: string,
    time: number,
    body: string,
    username:string,
    to:string,
    from: string,
    type: string,
    mark?: [number, string],
}