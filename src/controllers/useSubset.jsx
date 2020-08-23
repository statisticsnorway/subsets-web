import { useReducer, useEffect } from 'react';
import { nextDefaultName } from '../internationalization/languages';
import { URN } from './klass-api';
import { validate } from './validator';
import { Subset } from './Subset.prototype';

let errors = {
    id: [],
    name: [],
    validFrom: [],
    validUntil: [],
    period: [],
    createdBy: [],
    annotation: [],
    description: [],
    versionRationale: [],
    versionValidFrom: [],
    versionValidUntil: [],
    versionPeriod: [],
    origin: [],
    codes: []
};

function subsetReducer(state, {action, data = {}}) {
    console.info({action, data});
    switch (action) {
        case 'edit': {
            return Subset({...data,
                administrativeStatus: data?.administrativeStatus || 'DRAFT'
            });
        }
        case 'name_text': {
            state.updateNameTextByIndex(data.index, data.text);
            return Subset({...state});
        }
        case 'name_lang': {
            state.updateNameLanguageByIndex(data.index, data.lang)
            return Subset({...state});
        }
        case 'name_add': {
            console.log('add fired in name_add');

            state.addName(nextDefaultName(state.name));
            return Subset({...state});
        }
        case 'name_remove': {
            state.removeNameByIndex(data)
            return Subset({...state});
        }
        case 'shortName_update': {
            state.shortName = data;
            return Subset({...state});
        }
        case 'from': {
            state.validFrom = data;
            return Subset({...state});
        }
        case 'version_from': {
            const {date, versions} = data;
            // FIXME: restrictions
            if ((!versions || versions.length === 0) && state.version === '1') {
                console.info('Very first version');
                errors = { ...errors,
                    versionValidFrom: validate.versionValidFrom(state.validFrom, state.validUntil, date),
                    versionPeriod: validate.period(date, state.validUntil)
                };
                return Subset({...state,
                    versionValidFrom: date,
                    validFrom: date
                });
            }

            const latest = versions.sort((a, b) =>
                a.versionValidFrom < b.versionValidFrom ? 1 :
                    a.versionValidFrom > b.versionValidFrom ? -1 : 0)[0];
            // later version
            if ((latest?.validUntil && date === latest?.validUntil)
                || (!latest?.validUntil && date > latest?.versionValidFrom)) {
                console.info('Later version');
                const nextState = Subset({...state,
                    versionValidFrom: date,
                    versionValidUntil: state.versionValidUntil === latest?.validFrom ? null : state.versionValidUntil,
                    validUntil: state.versionValidUntil === latest?.validFrom ? null : state.versionValidUntil
                });
                errors = { ...errors,
                    versionValidFrom: validate.versionValidFrom(nextState.validFrom, latest?.validUntil, nextState.versionValidFrom),
                    versionPeriod: validate.period(nextState.versionValidFrom, nextState.versionValidUntil),
                    validFrom: validate.validFrom(nextState.validFrom),
                    period: validate.period(nextState.validFrom, nextState.validUntil)
                };
                return nextState;
            }

            // earlier version
            if (date >= new Date('1800-01-01').toISOString() && date < latest?.validFrom) {
                console.info('Earlier version');
                const nextState = Subset({
                    ...state,
                    versionValidFrom: date,
                    validFrom: date,
                    versionValidUntil: latest?.validFrom
                });
                errors = { ...errors,
                    versionValidFrom: validate.versionValidFrom(nextState.validFrom, nextState.validUntil, nextState.versionValidFrom),
                    versionPeriod: validate.period(nextState.versionValidFrom, nextState.versionValidUntil),
                    validFrom: validate.validFrom(nextState.validFrom),
                    period: validate.period(nextState.validFrom, nextState.validUntil)
                };
                return nextState;
            }

            // other
            console.info('Covered period or illegal input');
            const nextState = Subset({
                ...state,
                versionValidFrom: date,
                versionValidUntil: state.versionValidUntil === latest?.validFrom ? null : state.versionValidUntil
            });
            errors = { ...errors,
                versionValidFrom: validate.versionValidFrom(nextState.validFrom, nextState.validUntil, nextState.versionValidFrom),
                versionPeriod: validate.period(nextState.versionValidFrom, nextState.versionValidUntil),
                validFrom: validate.validFrom(nextState.validFrom),
                period: validate.period(nextState.validFrom, nextState.validUntil)
            };
            return nextState;
        }
        case 'version_to': {
            errors = { ...errors,
                period: validate.period(state.validFrom, data),
                versionPeriod: validate.period(state.versionValidFrom, data)
            };
            return Subset({...state, versionValidUntil: data, validUntil: data});
        }
        case 'previous_versions': {
            state.previousSubsets = data;
            return Subset({...state});
        }
        case 'version_rationale_add': {
            state.addVersionRationale(nextDefaultName(state.versionRationale));
            return Subset({...state});
        }
        case 'version_rationale_remove': {
            state.removeVersionRationaleByIndex(data);
            return Subset({...state});
        }
        case 'version_rationale_text': {
            state.updateVersionRationaleTextByIndex(data.index, data.text);
            return Subset({...state});
        }
        case 'version_rationale_lang': {
            state.updateVersionRationaleLanguageByIndex(data.index, data.lang);
            return Subset({...state});
        }
        case 'version_switch': {
            const {chosenVersion, versions} = data;
            if (chosenVersion === 'New version') {
                const latest = versions.sort((a,b) =>
                    a.versionValidFrom < b.versionValidFrom ? 1 :
                        a.versionValidFrom > b.versionValidFrom ? -1 : 0)[0];
                return Subset({
                    ...state,
                    version: `${ Math.max(...versions.map(v => v.version)) +1 }`,
                    administrativeStatus: 'INTERNAL',
                    versionRationale: [ nextDefaultName([]) ],
                    versionValidFrom: latest?.versionValidUntil,
                    versionValidUntil: null,
                    validUntil: null
                });
            } else {
                const exists = versions.find(v => v.version === chosenVersion);
                if (exists) {
                    const next = versions.filter(v => v.versionValidFrom > exists.versionValidFrom)
                        .sort((a, b) =>
                            a.versionValidFrom < b.versionValidFrom ? -1 :
                                a.versionValidFrom > b.versionValidFrom ? 1 : 0)[0];
                    return Subset({
                        ...exists,
                        version: exists.version,
                        versionRationale: exists.versionRationale?.length > 0
                            ? exists.versionRationale
                            : [ nextDefaultName([]) ],
                        versionValidFrom: exists.versionValidFrom,
                        versionValidUntil: next?.versionValidFrom || exists.validUntil,
                        codes: exists.codes
                    });
                }
            }
            return state;
        }
        case 'to': {
            // FIXME: restrictions
            errors = { ...errors,
                period: validate.period(state.validFrom, data)
            };
            return Subset({...state, validUntil: data});
        }
        case 'createdBy': {
            return  {...state, createdBy: data};
        }
        case 'subject': {
            // FIXME: mutable change
            state.administrativeDetails
                .find(d => d.administrativeDetailType === 'ANNOTATION')
                .values[0] = data;
            return Subset({...state});
        }
        case 'description_text': {
            state.updateDescriptionTextByIndex(data.index, data.text);
            return Subset({...state});
        }
        case 'description_lang': {
            state.updateDescriptionLanguageByIndex(data.index, data.lang);
            return Subset({...state});
        }
        case 'description_add': {
            state.addDescription(nextDefaultName(state.description));
            return Subset({...state});
        }
        case 'description_remove': {
            state.removeDescriptionByIndex(data);
            return Subset({...state});
        }
        case 'remove_empty': {
            state.removeEmptyNames();
            state.removeEmptyDescriptions();
            state.removeEmptyVersionRationales();
            return Subset({...state});
        }
        case 'codelist_include': {
            const annotation = state.administrativeDetails?.find(d => d.administrativeDetailType === 'ANNOTATION');
            const origin = state.administrativeDetails?.find(d => d.administrativeDetailType === 'ORIGIN');

            origin.values = origin.values.find(v => v === data) ? origin.values : [data, ...origin.values];
            return Subset({
                ...state,
                administrativeDetails: [annotation, origin]
            });
        }
        // DOCME: if a codelist is chosen, but no codes are checked,
        //  the code list remains in the subset until it explicitly excluded.
        case 'codelist_exclude': {
            const origin = state.administrativeDetails.find(d => d.administrativeDetailType === 'ORIGIN').values;
            state.administrativeDetails.find(d => d.administrativeDetailType === 'ORIGIN').values =
                origin.filter(urn => urn !== data);

            const codes = state.codes.filter(c => !c.urn.startsWith(data));

            return Subset({...state, codes});
        }
        case 'codes_include': {
            const candidates = data.filter(c => !state.codes.find(s => s.urn === c.urn));
            const administrativeDetails = updateOrigin(state.administrativeDetails, candidates);

            return Subset({
                ...state,
                administrativeDetails,
                codes: reorder([...candidates, ...state.codes])});
        }
        case 'codes_exclude': {
            const candidates = state.codes.filter(c => !data.find(s => s.urn === c.urn));
            return Subset({
                ...state,
                codes: reorder([...candidates])});
        }
        case 'codes_rerank': {
            data.codes.forEach(code => {
                const reranked = state.codes?.find(c => c.urn === code.urn);
                if (reranked && data.rank && data.rank !== '-') {
                    reranked.rank = data.rank;
                }
            });
            return Subset({
                ...state,
                codes: reorder([...state.codes])});
        }
        case 'codes_cache': {
            const codes = state.codes.map(s => s.urn !== data.urn ? s : {...s, ...data});
            return Subset({ ...state, codes});
        }
        case 'reset': {
            sessionStorage.removeItem('draft');
            return Subset();
        }
        default:
            return state;
    }
}

function reorder(list) {
    if (list?.length > 0) {
        list.sort((a, b) => (a.rank - b.rank -1));
    }
    return rerank(list);
}

function rerank(list) {
    return list.map((item, i) => ({
        ...item,
        rank: i + 1
    }));
}

function verifyOrigin(origin = [], codes = []) {
    // TESTME
    // TODO: if origin values are not empty, check if all values are valid URNs

    if (codes?.length === 0) {
        return [...origin];
    }

    const updated = new Set(origin);
    codes.forEach(c => updated.add(URN.toURL(c.urn).classificationURN));
    return [...updated];
}

// TESTME
function updateOrigin(administrativeDetails, codes) {
    const annotation = administrativeDetails?.find(d => d.administrativeDetailType === 'ANNOTATION');
    const origin = administrativeDetails?.find(d => d.administrativeDetailType === 'ORIGIN');

    origin.values = verifyOrigin(origin.values, codes);

    return [annotation, origin];
}

export const useSubset = (init = Subset()) => {

    // FIXME: if the draft in session storage is undefined, the whole app crashes with error message:
    // Error: A cross-origin error was thrown. React doesn't have access to the actual error object in development.
    // FIX: try catch
     const [draft, dispatch] = useReducer(subsetReducer, initialize());

    // FIXME: runs on every draft update, should run once the hook is initialized in the context
    // FIXME: discard on non-valid draft and return init
    function initialize() {
        const restored = JSON.parse(sessionStorage.getItem('draft'));
        if (restored) {

            const annotation =
                restored.administrativeDetails?.find(d => d.administrativeDetailType === 'ANNOTATION')
                || init.administrativeDetails?.find(d => d.administrativeDetailType === 'ANNOTATION');

            const origin =
                restored.administrativeDetails?.find(d => d.administrativeDetailType === 'ORIGIN')
                || init.administrativeDetails?.find(d => d.administrativeDetailType === 'ORIGIN');

            origin.values = verifyOrigin(origin.values, restored.codes);

            restored.administrativeDetails = [ annotation, origin ];
        }
        return Subset({...init, ...restored}) || Subset();
    }

    useEffect(() => {
        sessionStorage.setItem('draft', JSON.stringify(draft));
    }, [draft]);

    return {draft, dispatch, errors};
};
