import React from 'react';
import { PlusSquare } from 'react-feather';

export const PlusButton = ({
                                title = 'Add',
                                clickHandler = () => {},
                                disabled = false,
                                active = true
                            }) => {

    return (
        <button
            title={ title }
            onClick={ clickHandler }
            disabled={ disabled }
        >
            <PlusSquare style={{
                color: disabled || !active ? '#C3DCDC' : '#1A9D49',
                margin: '0 10px',
                cursor: 'pointer'
            }}
            />
        </button>
    );
};

