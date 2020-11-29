import React from 'react';
import { Download } from 'react-feather';

export const DownloadButton = ({
                                title = 'Download button',
                                clickHandler = () => {},
                                disabled = false
                            }) => {

    return (
        <button
            title={ title }
            onClick={ clickHandler }
            disabled={ disabled }
        >
            <Download style={{
                color: 'lightblue',
                margin: '0 10px',
                cursor: 'pointer'
            }}
            />
        </button>
    );
};

