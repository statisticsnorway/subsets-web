import React from 'react';
import { Accordion,
    Paragraph,
    Title,
    Link as SsbLink
} from '@statisticsnorway/ssb-component-library';
import { useTranslation } from 'react-i18next';
import { Code } from './Code';
import { eu } from '../utils/strings';
import {Brief, Id} from "./SubsetBrief";

export const SubsetPreview = ({ subset }) => {
    const { t } = useTranslation();

    // FIXME: show title in selected language, not just first in the name array.
    // TODO: show subset in other languages - switch button for language?
    // TODO: show versions?

    return (
        <>
            <Title size={2}>{subset.name[0]?.languageText || t('Subset has got no title yet')}</Title>
            <Paragraph><strong>ID:</strong> {subset.id || '-'}</Paragraph>
            <Paragraph><strong>{t('Subsets validity period')}</strong>
                { subset?.validFrom || subset?.validUntil
                    ? `: ${ t('from') } ${ eu(subset?.validFrom) || '...' } ${
                        t('to')} ${ eu(subset?.validUntil) || '...' }`
                    : `. ${ t('Period is not set') }.`
                }
            </Paragraph>
            <Paragraph><strong>{t('Versions validity period')}</strong>
                { subset?.versionValidFrom || subset?.versionValidUntil
                    ? `: ${ t('from') } ${ eu(subset?.versionValidFrom) || '...' } ${
                        t('to')} ${ eu(subset?.versionValidUntil) || '...' }`
                    : `. ${ t('Period is not set') }.`
                }
            </Paragraph>

            <Paragraph>{subset.description[0]?.languageText || t('No description')}</Paragraph>

            <Paragraph><strong>{t('Owner')}:</strong> {subset.createdBy || '-'}</Paragraph>

            <Paragraph><strong>{t('Subject')}:</strong> {subset.subject || '-'}</Paragraph>

            <Paragraph><strong>{t('Version')}:</strong> {subset.version || '-'}</Paragraph>

            <Title size={3}>{t('Codes')}: </Title>
            { subset.codes
                .sort((a,b) => (a.rank - b.rank))
                .map((code, i) => (
                    <Code key={i}
                          origin={{
                              ...code,
                              validFromInRequestedRange: subset.versionValidFrom,
                              validToInRequestedRange: subset.versionValidUntil || ''
                          }}
                    />))}

            <Accordion header={t('Raw JSON')}>
                <pre>{ JSON.stringify(subset.payload, null, 4) }</pre>
            </Accordion>
        </>
    );
};

export const SubsetBanner = ({subset}) => {
    const { t } = useTranslation();

    // FIXME: translate placeholders
    // TODO: smart language choice
    return (
        <div style={{margin: '50px 0'}}>
            <SsbLink href={`/subsets/${subset?.id}`} linkType='profiled'>
                {subset?.name?.find(name => name.languageCode === 'nb')?.languageText || t('No name')}
            </SsbLink>
            <p style={{fontSize: 'calc(10px + 0.3vmin)'}}>
                <Brief
                    id={<Id>{ subset?.id || '-' }</Id>}
                    version={ subset?.version }
                    lastUpdatedDate={ subset?.lastUpdatedDate }
                    status={ t(subset?.administrativeStatus) }
                />
            </p>
            <p style={{fontSize: 'calc(10px + 0.8vmin)', margin: '-5px 0'}}>{subset?.description?.find(
                description => description.languageCode === 'nb')?.languageText || t('No description')}
            </p>
        </div>
    );
};

export const Subsets = ({items}) => {
    return (
        <>{items?.length > 0 &&
            items.map((subset, i) => (<SubsetBanner key={i} subset={subset} />))}
        </>
    );
};
