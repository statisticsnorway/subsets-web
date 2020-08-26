export const validate = {

    id(id) {
        return !id || id.length === 0 || !(typeof id === 'string' || id instanceof String)
            ? ['ID is a mandatory field']
            : !(/([a-z0-9-_])$/.test(id))
                ? ['Only lower case letters, numbers, dashes, and underscores are allowed']
                : [];
    },

    name(names) {
        return names?.length > 0
            ? []
            : ['At least one name is required'];
    },

    validFrom(date) {
        return date ?
            []
            : ['A valid from date is required'];
    },

    period(from, to) {
        return !from || !to
            ? []
            : from > to
                ? ['Period cannot start later than end']
                : from === to
                    ? ['Period cannot include and exclude the same day']
                    : [];
    },

    versionValidFrom(version, from, to, versionFrom, allowedDates = []) {
        return !versionFrom
            ? ['A valid version from date is required']
            : versionFrom > to
                ? ['Versions cannot have gaps on validity periods']
                : version !== '1' && versionFrom <= to && versionFrom >= from && !allowedDates.includes(versionFrom)
                    ? ['This date is already covered in previous versions']
                    : [];
    },

    createdBy(owner) {
        return owner?.length > 0 ? [] : ['Owner is required'];
    },

    codes(codes) {
        return codes?.length > 0 ? [] : ['At least one code is required'];
    },

    subset(draft) {

         return {
            id: this.id(draft.id),
            name: this.name(draft.name),
            validFrom: this.validFrom(draft.validFrom),
            validUntil: [],
            period: this.period(draft.validFrom, draft.validUntil),
            createdBy: this.createdBy(draft.createdBy),
            annotation: [],
            description: [],
            origin: [],
            administrativeStatus: [],
            versionValidFrom: this.versionValidFrom(draft.version, draft.validFrom, draft.validUntil, draft._versionValidFrom),
            versionPeriod: this.period(draft._versionValidFrom, draft._versionValidUntil),
            codes: this.codes(draft.codes)
        };
    }
};