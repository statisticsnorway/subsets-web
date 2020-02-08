import React, {useEffect, useContext} from 'react';
import '../../css/form.css';
import {TextLanguageFieldset, Dropdown} from '../../utils/forms';
import {AppContext} from '../../controllers/context';
import {subsetDraft, languages} from '../../controllers/defaults';
import {Title} from '@statisticsnorway/ssb-component-library';
import DatePicker from 'react-date-picker';

/*
 *  TODO: select components (2) from the ssb-component-library
 *  TODO: textarea styled as input text in the ssb-component-library
 *  FIXME: buttons Next-Previous have to be aligned properly
 *  FIXME: make empty names and descriptions do not disappear at all
 *  TODO: remove fieldsets? or just its boarder: none
 *  FIXME: sanitize input
 */

export const SubsetMetadata = ({subset}) => {

    const {ssbsections, classificationfamilies} = useContext(AppContext);

    useEffect(() => {return () => subset.dispatch({action: 'remove_empty'});}, []);

    return (
        <>
            <Title size={3}>Metadata</Title>
            <TextLanguageFieldset title='Names' items={subset.draft.names}
                                  add={() => subset.dispatch({action: 'name_add'})}
                                  remove={(index) => subset.dispatch({action: 'name_remove', data: index})}
                                  handle={() => subset.dispatch({action: 'update'})}
                                  size={{cols: 65, rows: 1}}
                                  prefix={subsetDraft.namePrefix}
            />

                {/* TODO: set automatically when logged inn */}
            <Dropdown label='Owner'
                      options={ssbsections ? ssbsections._embedded.ssbSections : []}
                      placeholder='Select a responsible department...'
                      selected={subset.draft.ownerId}
                      onSelect={(item) => subset.dispatch({
                          action: 'ownerId',
                          data: item })}
            />

            <fieldset>
                <label style={{display:'block'}}>Valid period</label>
                <label>From:
                    <DatePicker value={subset.draft.valid.from}
                                onChange={(date) => subset.dispatch({action: 'from', data: date})}
                                clearIcon={null}
                                format='dd.MM.y'
                                locale={languages.find(i=> i.default).IETF}
                                className='datepicker'
                    />
                </label>
                <label>To:
                    <DatePicker value={subset.draft.valid.to}
                                onChange={(date) => subset.dispatch({action: 'to', data: date})}
                                clearIcon={null}
                                format='dd.MM.y'
                                locale={languages.find(i => i.default).IETF}
                                className='datepicker'
                    />
                </label>
            </fieldset>

            <Dropdown label='Subject'
                      options={classificationfamilies ? classificationfamilies._embedded.classificationFamilies : []}
                      placeholder='Select a classification family...'
                      selected={subset.draft.subject}
                      onSelect={(item) => subset.dispatch({
                          action: 'subject',
                          data: item })}
            />

            <TextLanguageFieldset title='Description' items={subset.draft.descriptions}
                                  add={() => subset.dispatch({action: 'description_add'})}
                                  remove={(index) => subset.dispatch({action: 'description_remove', data: index})}
                                  handle={() => subset.dispatch({action: 'update'})}
                                  size = {{cols: 65, rows: 4}}
            />


{/* TODO: implement in next version
            <label><input type='checkbox'/>Subscribe for changes</label>
*/}

            {/* TODO: implement in next version if ordered
            /* move to each fieldset (?)
            <Button onClick={() => {subset.dispatch({action: 'reset'});}}>Reset</Button>
*/}
        </>
    );
};
