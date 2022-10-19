import React from 'react'
import Card from './Card'

export const Stack = ({ stack }) => {
    return (
        <div className="stack">
            <h2>Stack</h2>
            {stack.type === "wild" ? <h2>Color: {stack.color}</h2> : null}
            <Card data={stack} />
        </div>
    )
}
