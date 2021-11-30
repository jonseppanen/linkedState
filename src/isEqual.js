//Fast, generic, early exiting deep object comparitor with no dependencies.

const getSimpleComparitor = (comparitor) => ["string", "number", "boolean"].includes(typeof comparitor);

export default function isEqual(compareFrom, compareTo) {
    if (typeof compareTo === "undefined" && typeof compareFrom !== "undefined") return false;
    if (typeof compareFrom === "undefined" && typeof compareTo !== "undefined") return false;
    if (typeof compareFrom !== typeof compareTo) return false;
    if (typeof compareFrom === "undefined" && typeof compareTo === "undefined") return true;

    if (getSimpleComparitor(compareFrom)) {
        return JSON.stringify(compareFrom) === JSON.stringify(compareTo);
    }

    if (Array.isArray(compareFrom)) {
        if (compareFrom.length !== compareTo.length) return false;

        let arrayReturn = true;

        for (var i = 0; i < compareFrom.length; i++) {
            if (!isEqual(compareFrom[i], compareTo[i])) {
                arrayReturn = false;
                break;
            }
        }

        return arrayReturn;
    }

    if (typeof compareFrom === "object") {
        if (Object.keys(compareFrom).length !== Object.keys(compareTo).length) return false;

        let objectReturn = true;

        for (let key of Object.keys(compareFrom)) {
            if (!(key in compareTo)) {
                objectReturn = false;
                break;
            }

            if (!isEqual(compareTo[key], compareFrom[key])) {
                objectReturn = false;
                break;
            }
        }

        return objectReturn;
    }
}
