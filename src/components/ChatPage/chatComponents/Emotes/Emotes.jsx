import { useMemo, useState } from "react";
import { EmoteComponent } from "./EmoteComponent";

export const Emotes = ({emotesList, className}) => {
    const [emotes, setEmotes] = useState(Object.values(emotesList));
    const memoEmotes = useMemo(()=> emotes, [emotes]);
    // const emotesCheck
    // fetch emotes... //setEmotes
    return (
        memoEmotes.map(element => {
            const { id, src } = element;
            return (
                <EmoteComponent className={className} id={"input-" + id} key={id} src={src}/>
            )
        })
    )
}