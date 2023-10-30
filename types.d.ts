interface Workspace {
    id: string;
    agenda: string;
    ideas?: Ideas[];
    notes?: Object;
}

interface Ideas {
    text: string;
    pros?: string[];
    cons?: string[];
    notes?: Object;
}
