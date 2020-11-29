import React from 'react';
import { useTranslation } from 'react-i18next';
import { JsonView } from '../../JsonView';
import { HtmlView } from './HtmlView';
import { EditButton, DownloadButton } from '../../Buttons';
import { Tabs, Tab } from '../../Tabs';

export const Metadata = ({
                             edit = () => {},
                             subset = {}
                         }) => {
    const { t } = useTranslation();

    return (
        <>
            <h2>{ t('Metadata') }
                <DownloadButton title={ t('Download') }/>

                { edit && <EditButton
                    title={ t('Edit metadata') }
                    clickHandler={ edit }
                />}
            </h2>
            <p>{ t('Metadata info') }.</p>
            <p>{ t('Subset validity period info') }.</p>
            <p>{ t('Owning section info') }.</p>
            <Tabs light>
                <Tab title='HTML' path='html'>
                    <HtmlView subset={ subset } />
                </Tab>
                <Tab title='JSON' path='json'>
                    <JsonView data={ subset.payload || subset } />
                </Tab>
            </Tabs>
    </>);
};

