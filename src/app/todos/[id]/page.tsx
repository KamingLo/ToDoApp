"use client";

import {useParams} from "next/navigation";

export default function TodoDetail() {
    const {id} = useParams<{id : string}>();

    return(
        <main>
            <h1>Task Detail</h1>
            <p>Task ID: {id}</p>
        </main>
    );
};