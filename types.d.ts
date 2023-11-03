interface NoteObject {
    email: string;
    notes: OutputData;
}

interface Workspace {
    id: string;
    agenda: string;
    ideas?: Idea[];
    notes?: NoteObject[];
    users?: User[];
    owner: string;
}

interface Idea {
    id: string;
    name: string;
    pros?: string[];
    cons?: OutputData;
    description?: Object;
    votes: string[]; // just the email of the person who voted for it
    notes: OutputData; // Only one note so no need of the user email
    comments: IdeaComment[];
    users?: User[];
}

interface User {
    email: string;
    name: string;
}

interface IdeaComment {
    content: string;
    user: { email: string; name: string };
}
