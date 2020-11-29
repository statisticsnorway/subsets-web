import { useTranslation } from 'react-i18next';
import { eu, euTime } from '../../../utils/strings';
import React from 'react';
import { Status } from '../../Tag';

export const Brief = ({ id = '-',
                          created,
                          lastModified,
                        validFrom,
                        validUntil,
                          status,
                          toBeSaved = 0
                      }) => {
    const { t } = useTranslation();

    return (
        <p className='small'>
            { t('Current version') }: <strong>{ id }  </strong>
            { t('Versions validity period') }: <strong>{ validFrom || '...' } - { validUntil | '...'} </strong>
            { t('Created') }: <strong>{ eu(created) || '-' }  </strong>
            { t('Updated') }: <strong>{ euTime(lastModified) || '-' }  </strong>
            { status && <Status label={ t(status) } /> }
            { toBeSaved && <strong>{ t('Not saved') } </strong> }
        </p>
    );
};