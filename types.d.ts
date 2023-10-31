interface NoteObject {
    email: string;
    notes: OutputData;
}

interface Workspace {
    id: string;
    agenda: string;
    ideas?: Idea[];
    notes?: NoteObject[];
    user?: string;
}

interface Idea {
    id: string;
    name: string;
    pros?: string[];
    cons?: string[];
    description?: Object;
    votes: string[]; // just the email of the person who voted for it
    notes: OutputData; // Only one note so no need of the user email
}

interface User {
    email: string;
    name: string;
    image: string;
}
