import React from 'react';
import { CodeDumb } from './CodeDumb';
import { useTranslation } from 'react-i18next';
import { Datepicker } from '../Forms';
import { flatten } from '../../utils';
import { Title, Introduction } from '../../components';

export const Codes = ({ data = [], edit = () => {} }) => {
    const { t } = useTranslation();

    return (
        <>
            <Title text='Codes' edit={ edit } download />

            <Introduction texts={[ 'Codes filter info' ]} />

            <div className='period' style={{ display: 'flex'}}>

                <Datepicker label='Valid from'
                            style={{ float: 'left' }}
                />
                <Datepicker label='Valid to'
                            style={{ float: 'right'}}/>

                <br style={{ clear: 'both' }}/>
            </div>

            <h3>{ t('Codes valid in the specified period') }: 01.01.2020 - ...</h3>
            {/* FIXME: check the validity period is set correctly*/}
            { flatten(data.map(version => version.codes))
                .map((code, i) => (
                        <CodeDumb key={i} origin={code} />
                    )
                )
            }
        </>
    );
}