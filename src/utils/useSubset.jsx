import {useReducer, useEffect} from 'react';
import {nextDefaultName} from './languages';
import {URN} from '../controllers/klass-api';

export const useSubset = (init =  {
    createdBy: '',
    name: [],
    validFrom: null,
    validUntil: null,
    administrativeDetails: [
        {
            administrativeDetailType: 'ANNOTATION',
            values: []
        },
        {
            administrativeDetailType: 'ORIGIN',
            values: []
        }
    ],
    description: [],
    administrativeStatus: 'DRAFT',
    codes: [],
    classifications: []
}
    ) => {

    function expandCode(source = {}, from = '', to = '') {
            const {code, classificationId, classificationURN} = URN.toURL(source.urn, from, to);
            return {
                ...source,
                code,
                classificationId,
                classificationURN,
                validFromInRequestedRange: from,
                validToInRequestedRange: to
            }
    }

    function verifyOrigin(origin = [], codes = []) {

        // TODO: if origin values are not empty, check if all values are valid URNs

        if (codes?.length === 0) return [...origin];

        const updated = new Set(origin);
        codes.forEach(c => updated.add(c.classificationURN));
        return [...updated];
    }

    function extractClassifications(urns = [], codes = []) {
        return urns.map(urn => ({
                urn,
                included: true,
                codes: codes
                    .filter(code => code.urn.startsWith(urn))
                    .map(code => ({
                        ...code,
                        included: true})
                    )
                    || []
            })
        );
    }

    function subsetReducer(state, {action, data = {}}) {
        switch (action) {
            case 'edit': {
                return  {...data};
            }
            case 'update': {
                return  {...state};
            }
            case 'name_add': {
                const name = nextDefaultName(state.name);
                return  name === null
                    ? {...state}
                    : {...state, name: [...state.name, name]};
            }
            case 'name_remove': {
                return {
                    ...state,
                    name: state.name.filter((item, index) => index !== data)
                };
            }
            case 'from': {
                // FIXME: restrictions
                state.validFrom = data;
                return {...state};
            }
            case 'to': {
                // FIXME: restrictions
                state.validUntil = data;
                return {...state};
            }
            case 'createdBy': {
                return  {
                    ...state,
                    createdBy: data
                };
            }
            case 'subject': {
                // FIXME: mutable change
                state.administrativeDetails
                    .find(d => d.administrativeDetailType === 'ANNOTATION')
                    .values[0] = data;
                return  {...state};
            }
            case 'description_add': {
                const description = nextDefaultName(state.description);
                return  description === null
                    ? {...state}
                    : {...state, description: [...state.description, description]};
            }
            case 'description_remove': {
                return {
                    ...state,
                    description: state.description.filter((item, index) => index !== data)
                };
            }
            case 'classifications_from_origin': {
                const classifications = extractClassifications(
                    state.administrativeDetails.find(d => d.administrativeDetailType === 'ORIGIN').values,
                    state.codes);
                return {...state, classifications};
            }
/*            case 'classifications': {
                return  {...state, classifications: data};
            }*/
            case 'classifications_prepend_included': {
                 const included = data.filter(item => !state.classifications?.includes(item) && (item.included
                    || item.codes?.find(code => code.included)));
                return  state.classifications
                    ? {...state, classifications: [...included, ...state.classifications]}
                    : {...state, classifications: [...included]};
            }
            case 'classifications_remove_excluded': {
                return  {...state, classifications: state.classifications.filter(c => c.included)};
            }
            case 'remove_empty': {
                return {...state,
                    name: state.name.filter(item => item.languageText?.length > 0),
                    description: state.description.filter(item => item.languageText?.length > 0)
                };
            }
            case 'reset': {
                sessionStorage.removeItem('draft');
                return init;
            }
            default:
                return state;
        }
    }

    // FIXME: if the draft in session storage is undefined, the whole app crashes with error message:
    // Error: A cross-origin error was thrown. React doesn't have access to the actual error object in development.
    // FIX: try catch
    const [draft, dispatch] = useReducer(subsetReducer, initialize());

    function initialize() {
        const restored = JSON.parse(sessionStorage.getItem('draft'));
        if (restored) {
            const codes = restored.codes?.map(code => expandCode(
                code,
                restored.validFrom?.substr(0, 10),
                restored.validTo?.substr(0, 10)
            ));

            const annotation =
                restored.administrativeDetails.find(d => d.administrativeDetailType === 'ANNOTATION')
                || init.administrativeDetails.find(d => d.administrativeDetailType === 'ANNOTATION');

            const origin =
                restored.administrativeDetails.find(d => d.administrativeDetailType === 'ORIGIN')
                || init.administrativeDetails.find(d => d.administrativeDetailType === 'ORIGIN');

            origin.values = verifyOrigin(origin.values, codes);

            restored.administrativeDetails = [ annotation, origin ]
        }

        return {...restored} || init;
    }

    useEffect(() => {
        sessionStorage.setItem('draft', JSON.stringify(draft));
    }, [draft]);

    return {draft, dispatch};

};