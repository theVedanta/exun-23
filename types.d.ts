interface Workspace {
    id: string;
    agenda: string;
    ideas?: Ideas[];
    notes?: Object;
    user?: string;
}

interface Ideas {
    id: string;
    name: string;
    pros?: string[];
    cons?: string[];
    description?: Object;
}
