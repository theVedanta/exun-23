interface Workspace {
    id: string;
    agenda: string;
    ideas?: Ideas[];
    notes?: Object;
}

interface Ideas {
    id: string;
    name: string;
    description?: string;
    pros?: string[];
    cons?: string[];
    description?: Object;
}
