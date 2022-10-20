import { Alert } from '@mui/material'
import React from 'react'

import "../styles/Notifications.css";

export const Notifications = ({notifications}) => { 
    return (
        <div className="notifications">
            {
                notifications.map((notification, i) => (
                    <Alert key={i} severity='info' className='notification'>
                        {notification}
                    </Alert>
                ))
            }
        </div>
    )
}
