


interface Item{
    id: number,
    name: string,
    price: number,
    amount: number,
    image?:string
}

interface Drink extends Item{
}

interface Member {
    id:number;
    image?: string;
    first_name: string;
    last_name: string;
    balance: number;
    status: string;
}

interface Window{
    require: NodeRequire
}

declare module '*.json';