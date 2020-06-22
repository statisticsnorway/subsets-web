import React, {useEffect} from 'react';
import '../../css/pages.css';
import {useTranslation} from 'react-i18next';
import {Button, Title, FormError} from '@statisticsnorway/ssb-component-library';
import {SubsetPreview} from '../Subset';
import {usePost, usePut} from '../../controllers/subsets-service';
import {useHistory} from 'react-router-dom';

export const PublishFormStep = ({subset}) => {
    const {draft, dispatch, errors} = subset;

    const { t } = useTranslation();

    let history = useHistory();

    const [post, setPOSTPayload, isLoadingPost, errorPost] = usePost();
    const [update, setPUTPayload, isLoadingUpdate, errorUpdate] = usePut();

    useEffect(() => {
        if ((post !== null || update !== null) && !(post?.error || update?.error)) {
            dispatch({action: 'reset'});
            history.push(`/subsets/${draft.id}`);
        }
    }, [post, update]);

    // FIXME: workaround caused server not sending exception on error
    useEffect(() => {
        (errorPost !== null || errorUpdate !== null || post?.error || update?.error) &&
            alert(`Publishing failed: ${JSON.stringify(errorPost || errorUpdate || post?.error || update?.error)}`);
    }, [errorPost, errorUpdate, post, update]);

    useEffect(() => dispatch({action: 'validate'}), [draft, dispatch]);

    return (
        <>
            <Title size={3}>{t('Review and publish')}</Title>
            <SubsetPreview subset={draft}/>

            { Object.values(errors).flat().length > 0 &&
                <FormError title={t('Some fields are not right')}
                           errorMessages={Object.values(errors).flat().map(e => t(e))}
                />
            }

            <div style={{margin: '5px 0 5px 0', width: '60%'}}>

                <div style={{float: 'left', marginRight: '20px', padding: '0'}}>
                    <Button
                        disabled={update !== null || Object.values(errors).flat().length > 0 || draft.administrativeStatus === 'OPEN'}
                        onClick={() => draft.administrativeStatus === 'INTERNAL'
                            ? setPOSTPayload({...draft, administrativeStatus: 'DRAFT'})
                            : setPUTPayload({...draft, administrativeStatus: 'DRAFT'})
                        }>{t('Save')}
                    </Button>
                </div>

                <div style={{float: 'right'}}>
                    <Button
                        disabled={post !== null || Object.values(errors).flat().length > 0}
                        onClick={() => draft.administrativeStatus === 'INTERNAL'
                            ? setPOSTPayload({...draft, administrativeStatus: 'OPEN'})
                            : setPUTPayload({...draft, administrativeStatus: 'OPEN'})
                        }>{t('Publish')}
                    </Button>
                </div>

                <br style={{clear: 'both'}}/>
            </div>

            <br/><br/>
        </>
    );
};
