interface Workspace {
    id: string;
    agenda: string;
    ideas?: Idea[];
    notes?: Object;
    user?: string;
}

interface Idea {
    id: string;
    name: string;
    pros?: string[];
    cons?: string[];
    description?: Object;
    votes: string[]; // just the email of the person who voted for it
}

interface User {
    email: string;
    name: string;
    image: string;
}
