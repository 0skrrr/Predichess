import { EditorLayout } from "./editor/EditorLayout";
import { LearnLayout } from "./learn/LearnLayout";
import {Home} from "./home/Home";

interface NormalContentProps {
    contentType: string;
}
// Výběr typu obsahu
export function NormalContent({ contentType }: NormalContentProps) {
    switch (contentType) {
        case "home":
            return <Home/>
        case "learn":
            return <LearnLayout />
        case "editor":
            return <EditorLayout></EditorLayout>
        default:
            return <Home/>
    }
}