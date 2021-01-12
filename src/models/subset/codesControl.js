export const codesControl = (state = {}) => ({

    prependCodes(codes = []) {
        // console.debug('prependCodes', codes);

        const addition = codes.map(code => [
            `${code.classificationId}:${code.code}:${encodeURI(code.name)}`,
            { ...code, rank: -new Date().getTime() }
        ]);

        const merged = new Map([...addition, ...state.codesMap]);
        state.codes = [ ...merged.values() ];
    },

    removeCodes(codes = []) {
        //console.debug('deleteCodes', codes);

        const updated = state.codesMap;
        codes?.forEach(code => updated.delete(`${code.classificationId}:${code.code}:${encodeURI(code.name)}`));
        state.codes = [ ...updated.values() ];
    },

    removeCodesWithClassificationId(id) {
        state.codes = state.codes.filter(c => c.classificationId !== id);
    },

    reorderCodes() {
        // console.debug('reorderCodes', state.codes);

        state.codes.sort((a, b) => (a.rank - b.rank -1));
    },

    rerankCodes() {
        // console.debug('rerankCodes', state.codes);

        state.codes.forEach((item, i) => {
            item.rank = i + 1;
        });
    },

    changeRank(rank, codes) {
        // console.debug('changeRank', rank, codes);

        if (rank && rank !== '-') {
            state.codes = state.codes.map(c => codes.find(i => i.id === c.id)
                    ? {...c, rank}
                    : c
            )
        }
    }

});