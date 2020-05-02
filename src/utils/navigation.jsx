import React, {useState} from 'react';
import {Button} from '@statisticsnorway/ssb-component-library';
import '../css/tooltip.css';
import {useTranslation} from "react-i18next";

// TODO: add api to navigate to particular steps from inside og the form.
// For instance from the last (preview) page.
export function Navigation({children}) {
    const [step, setStep] = useState(0);

    return (
        <div className='mb-40'>
            <ProgressBar steps={children} handleClick={setStep} activeStep={step} />
            <div>{children[step]}</div>
            <PrevNext min={step===0} max={step===children.length-1} handleClick={setStep} />
        </div>
    );
}

export const Step = ({children}) => {
    return <>{children}</>;
};

export const ProgressBar = ({steps, handleClick, activeStep}) => {

    return (
        <div className='navigation-bar'>
            {steps.map((step, index) => (
                <div className='tooltip'>
                    <button key={index}
                        onClick={ () => handleClick(index) }
                        style={{
                            borderRadius: '50%',
                            background: activeStep === index ? '#62919A' : '#C3DCDC',
                            border: 'none',
                            color: 'transparent',
                            textAlign: 'center',
                            textDecoration: 'none',
                            display: 'inline-block',
                            padding: '1px 5px',
                            margin: '0 30px 0 0',
                            ariaLabel: `notifications-label-${index}`
                        }}
                        >{index}
                    </button>
                    <span className="tooltiptext" style={{ borderBottom: '1px dotted #274247'}}
                          role="tooltip"
                          id={`notifications-label${index}`}>{step.props.label}</span>
                </div>
            ))}
        </div>
    );
};

export const PrevNext = ({min, max, handleClick}) => {
    const { t } = useTranslation();

    const next = () => {
        handleClick((state) => (state+1));
        window.scrollTo(0, 0);
    };

    const prev = () => {
        handleClick((state) => (state-1));
        window.scrollTo(0, 0);
    };

    // TODO: place buttons on the same place on the each step page -> on the side, not bottom
    // It should be possible to click forward and backward without scrolling
    return (
        <div style={{margin: '5px 0 5px 0', width: '60%'}}>
        <div style={{float: 'left', marginRight: '20px', padding: '0'}}>
            <Button primary disabled={min} onClick={ prev }>{t('Previous')}</Button>
        </div>
            <div style={{float: 'right'}}>
            <Button primary disabled={max} onClick={ next }>{t('Next')}</Button>
            </div>
            <br style={{clear: 'both'}}/>
        </div>
    );
};